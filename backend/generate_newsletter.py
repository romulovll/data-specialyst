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

import feedparser
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


def fetch_release_notes(days=7):
    """Fetch GCP release notes from the past N days."""
    feed = feedparser.parse(RSS_URL)
    cutoff = datetime.utcnow() - timedelta(days=days)
    entries = []

    for entry in feed.entries:
        published = datetime(*entry.published_parsed[:6])
        if published >= cutoff:
            entries.append({
                "title": entry.title,
                "summary": entry.summary[:500],
                "link": entry.link,
                "published": published.strftime("%b %d, %Y"),
            })

    return entries


def identify_components(entries):
    """Tag each entry with matching GCP components."""
    for entry in entries:
        text = (entry["title"] + " " + entry["summary"]).lower()
        entry["components"] = []
        for comp in COMPONENTS:
            if comp.lower() in text:
                entry["components"].append(comp)
        if not entry["components"]:
            entry["components"] = ["General"]
    return entries


def generate_issue(entries):
    """Use Claude API to generate a newsletter issue."""
    if not ANTHROPIC_API_KEY:
        print("ERROR: ANTHROPIC_API_KEY not set")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    entries_text = "\n\n".join([
        f"**{e['title']}** ({e['published']})\n{e['summary']}\nComponents: {', '.join(e['components'])}"
        for e in entries[:20]
    ])

    prompt = f"""You are writing a newsletter issue for "Cloud Decoded" — a newsletter that takes Google Cloud announcements and explains them in simple language with practical examples.

Here are the GCP release notes from the past week:

{entries_text}

Write ONE newsletter issue that covers the most significant updates. Follow this exact JSON format:

{{
  "date": "{datetime.utcnow().strftime('%b %d, %Y')}",
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
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}],
    )

    text = response.content[0].text.strip()
    return json.loads(text)


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

    print("Fetching GCP release notes...")
    entries = fetch_release_notes(days=7)
    print(f"Found {len(entries)} updates from the past week.")

    if not entries:
        print("No updates found. Skipping.")
        return

    entries = identify_components(entries)

    print("Generating newsletter issue with Claude...")
    issue = generate_issue(entries)

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
