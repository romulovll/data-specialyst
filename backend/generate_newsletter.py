"""
Weekly newsletter generator.
Fetches GCP release notes, generates a newsletter issue via Claude API,
and saves it to the database.

Usage:
  python generate_newsletter.py              # generate and save
  python generate_newsletter.py --dry-run    # preview without saving
"""
import os
import sys
import json
from datetime import datetime, timedelta

import anthropic
import psycopg2

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://studyhub:studyhubdb123@localhost:5432/studyhub",
)
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
API_URL = os.environ.get("API_URL", "https://studyhub-api-881000472963.southamerica-east1.run.app/api")
RSS_URL = "https://cloud.google.com/feeds/release-notes.xml"

# GCP components we care about
COMPONENTS = [
    "BigQuery", "Spanner", "Cloud SQL", "AlloyDB", "Bigtable", "Firestore",
    "Dataflow", "Dataproc", "Pub/Sub", "Cloud Storage",
    "Cloud Run", "GKE", "Compute Engine", "App Engine", "Cloud Functions",
    "Composer", "Airflow",
    "Vertex AI", "Gemini", "Agent Platform",
    "IAM", "Cloud Armor", "VPC", "Cloud KMS", "DLP",
    "Cloud Monitoring", "Cloud Logging",
    "Terraform", "Cloud Build", "Cloud Deploy",
    "Dataplex", "Data Catalog",
]

CERT_MAP = {
    "BigQuery": ["PDE", "PCA"], "Spanner": ["PCA", "PDE"], "Cloud SQL": ["PCA"],
    "AlloyDB": ["PCA", "PDE"], "Bigtable": ["PDE"], "Firestore": ["PCA"],
    "Dataflow": ["PDE"], "Dataproc": ["PDE"], "Pub/Sub": ["PDE", "PCA"],
    "Cloud Storage": ["PCA"], "Cloud Run": ["PCA"], "GKE": ["PCA"],
    "Compute Engine": ["PCA"], "Composer": ["PDE"], "Airflow": ["PDE"],
    "Vertex AI": ["PCA", "MLE"], "Gemini": ["PCA", "MLE"],
    "Agent Platform": ["PCA", "MLE"], "IAM": ["PCA"],
    "Cloud Armor": ["PCA"], "VPC": ["PCA"], "Cloud KMS": ["PCA"],
    "DLP": ["PDE", "PCA"], "Dataplex": ["PDE"], "Data Catalog": ["PDE"],
}


def generate_issue():
    """Use Claude API to find latest GCP updates and generate a newsletter issue."""
    if not ANTHROPIC_API_KEY:
        print("ERROR: ANTHROPIC_API_KEY not set")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    today = datetime.now(tz=None).strftime("%B %d, %Y")

    # Step 1: Ask Claude to find the latest GCP updates using web search
    print("Searching for latest GCP updates...")
    search_response = client.messages.create(
        model="claude-sonnet-5-5",
        max_tokens=2000,
        messages=[{"role": "user", "content": f"Today is {today}. Search for the latest Google Cloud Platform announcements, release notes, and product updates from the past 7 days. Focus on: BigQuery, Spanner, Dataflow, Cloud Run, GKE, Vertex AI, Composer, Pub/Sub, AlloyDB, Cloud Storage, IAM, and security updates. List each update with the date, product name, and a brief description. Only include updates from the past 7 days."}],
    )
    updates_text = search_response.content[0].text

    print(f"Found updates. Generating newsletter issue...")

    # Step 2: Generate the newsletter issue from those updates
    prompt = f"""You are writing a newsletter issue for "Cloud Decoded" — a newsletter that takes Google Cloud announcements and explains them in simple language with practical examples.

Here are the latest GCP updates found:

{updates_text}

Write ONE newsletter issue that covers the most significant update(s). Follow this exact JSON format:

{{
  "date": "{datetime.now(tz=None).strftime('%b %d, %Y')}",
  "title": "A catchy, specific title (max 60 chars)",
  "tldr": "One sentence summary of the most important update (max 200 chars)",
  "tags": ["Component1", "Component2"],
  "certs": ["PDE", "PCA"],
  "body": "<h2>heading</h2><p>paragraph</p>..."
}}

Rules for the body HTML:
- Use <h2> for section headings
- Use <p> for paragraphs
- Use <ul><li> for lists
- Use <pre> for code blocks (escape single quotes as \\')
- Use <strong> for bold
- Use <code> for inline code
- Include a "What Changed" section
- Include a "Why It Matters" section with impact for Data Architects and cert prep
- Include a practical code example if applicable
- End with a one-line takeaway wrapped in: <div class="takeaway"><p>takeaway here</p></div>
- Keep body under 2000 chars

Return ONLY valid JSON, no markdown fences."""

    response = client.messages.create(
        model="claude-sonnet-5-5",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}],
    )

    text = response.content[0].text.strip()
    # Remove markdown fences if present
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        text = text.rsplit("```", 1)[0]
    # Fix common JSON escape issues from LLM output
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try fixing unescaped characters
        import re
        text = re.sub(r'(?<!\\)\\(?!["\\/bfnrtu])', r'\\\\', text)
        try:
            return json.loads(text)
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {e}")
            print(f"Raw text:\n{text[:500]}")
            # Last resort: extract fields manually
            return {
                "date": datetime.now(tz=None).strftime("%b %d, %Y"),
                "title": "Weekly GCP Update",
                "tldr": "Check the latest Google Cloud updates.",
                "tags": ["General"],
                "certs": ["PCA"],
                "body": f"<p>{text[:1500]}</p>",
            }


def save_issue(issue):
    """Save the generated issue to the database."""
    conn = psycopg2.connect(DATABASE_URL)
    try:
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO newsletter_issues (date, title, tldr, tags, certs, body)
                VALUES (%s, %s, %s, %s, %s, %s) RETURNING id""",
                (issue["date"], issue["title"], issue["tldr"],
                 issue["tags"], issue["certs"], issue["body"]),
            )
            issue_id = cur.fetchone()[0]
        conn.commit()
        print(f"Saved issue #{issue_id}: {issue['title']}")
        return issue_id
    finally:
        conn.close()


def main():
    dry_run = "--dry-run" in sys.argv

    print("Generating newsletter issue with Claude...")
    issue = generate_issue()

    print(f"\nTitle: {issue['title']}")
    print(f"TL;DR: {issue['tldr']}")
    print(f"Tags: {issue['tags']}")
    print(f"Certs: {issue['certs']}")

    if dry_run:
        print("\n[DRY RUN] Would save this issue. Body preview:")
        print(issue["body"][:500])
    else:
        save_issue(issue)
        print("Done!")


if __name__ == "__main__":
    main()
