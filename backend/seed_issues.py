"""Seed existing newsletter issues into the database."""
import os
import json
import psycopg2

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres:pactdb123@34.95.200.22:5432/studyhub",
)

ISSUES = [
    {"date": "Oct 13, 2026", "title": "Composer 3 Gets Dev Mode & Hibernation", "tldr": "Create Airflow 3 environments in dev mode to test DAGs before production. Hibernate them to reduce costs to near zero.", "tags": ["Composer", "Airflow"], "certs": ["PDE", "PCA"]},
    {"date": "Oct 9, 2026", "title": "Dataflow Now Ingests CDC from Delta Lake & Iceberg", "tldr": "Sync change data capture logs from Delta Lake and Iceberg tables into your Lakehouse using Dataflow batch or streaming jobs.", "tags": ["Dataflow", "Lakehouse"], "certs": ["PDE"]},
    {"date": "Sep 24, 2026", "title": "GKE Ambient Networking: Service Mesh Without Sidecars", "tldr": "GKE ambient networking provides service discovery, zero-trust, and traffic management with 10x less resource usage — no sidecar proxies.", "tags": ["GKE", "Networking"], "certs": ["PCA"]},
    {"date": "Sep 21, 2026", "title": "AlloyDB Scales to 10 Billion Vectors with ScaNN", "tldr": "AlloyDB now supports 10B vectors using Google ScaNN index — 6x faster than standard PostgreSQL HNSW. Plus new AI functions.", "tags": ["AlloyDB", "AI", "Databases"], "certs": ["PCA", "PDE"]},
    {"date": "Sep 3, 2026", "title": "Cloud Storage Gets Object Enrichments with ML", "tldr": "Cloud Storage automatically applies ML models to images and PDFs, attaching metadata like labels and text extraction directly to objects.", "tags": ["Cloud Storage", "AI"], "certs": ["PCA"]},
    {"date": "Jun 16, 2026", "title": "Dataflow Gets NVIDIA RTX Pro 6000 GPUs", "tldr": "Run ML inference directly in your Dataflow pipelines with NVIDIA RTX Pro 6000 GPUs. No separate serving infrastructure needed.", "tags": ["Dataflow", "GPU", "AI"], "certs": ["PDE"]},
    {"date": "May 2026", "title": "Google I/O: Gemini 3.5 and Computer Use", "tldr": "Gemini 3.5 launched with computer use — AI agents can see, reason, and act across desktop, mobile, and browser.", "tags": ["Gemini", "AI", "Agents"], "certs": ["PCA", "MLE"]},
    {"date": "Apr 22, 2026", "title": "Vertex AI Is Dead. Meet Gemini Enterprise Agent Platform.", "tldr": "Google rebranded Vertex AI into the Gemini Enterprise Agent Platform. From building ML models to building AI agents.", "tags": ["Vertex AI", "Agents", "AI Platform"], "certs": ["PCA", "MLE"]},
    {"date": "Apr 22, 2026", "title": "BigQuery Became a Cross-Cloud Lakehouse", "tldr": "BigQuery reads from S3 and Azure without copying data. Reverse ETL pushes analytics to Spanner in one SQL.", "tags": ["BigQuery", "Lakehouse", "Multi-Cloud"], "certs": ["PDE", "PCA"]},
    {"date": "Apr 22, 2026", "title": "Spanner Omni + Columnar Engine + AI Functions", "tldr": "Spanner runs on AWS, Azure, on-prem. Columnar Engine does analytics 200x faster on live data.", "tags": ["Spanner", "Multi-Cloud", "Databases"], "certs": ["PCA", "PDE"]},
    {"date": "Apr 22, 2026", "title": "Cloud Run: Agent Identity, Sandboxes, GPUs", "tldr": "Cloud Run got Agent Identity, 300 sandboxes/sec, and NVIDIA RTX PRO 6000 GPUs. Serverless is now the agent runtime.", "tags": ["Cloud Run", "Agents", "GPU"], "certs": ["PCA"]},
    {"date": "Apr 22, 2026", "title": "Cloud Armor Gets AI-Powered Threat Detection", "tldr": "New managed rules detect L7 attacks and zero-day CVEs. Model Armor protects against prompt injection and data leakage.", "tags": ["Security", "Cloud Armor"], "certs": ["PCA"]},
    {"date": "Apr 16, 2026", "title": "Pub/Sub Gets AI Inference & Bigtable Streaming", "tldr": "Apply Gemini inference directly on Pub/Sub event streams. Stream messages directly to Bigtable without a subscriber.", "tags": ["Pub/Sub", "Bigtable", "AI"], "certs": ["PDE", "PCA"]},
    {"date": "Apr 15, 2026", "title": "Airflow 3 Lands in Cloud Composer 3", "tldr": "Apache Airflow 3.0 is GA in Cloud Composer 3 — new UI, improved scheduler, better REST API.", "tags": ["Composer", "Airflow"], "certs": ["PDE"]},
    {"date": "Feb 2026", "title": "Gemini 3.1 Pro Launches Across GCP", "tldr": "Gemini 3.1 Pro available on Vertex AI, Gemini API, AI Studio, and NotebookLM. Improved reasoning for complex workflows.", "tags": ["Gemini", "AI"], "certs": ["PCA", "MLE"]},
    {"date": "Jan 2026", "title": "BigQuery AI Functions: AI.GENERATE, AI.EMBED, AI.SIMILARITY", "tldr": "Run sentiment analysis, generate embeddings, compute similarity — all in SQL. One query replaces your entire Python ML pipeline.", "tags": ["BigQuery", "AI"], "certs": ["PDE", "PCA"]},
]

def seed():
    conn = psycopg2.connect(DATABASE_URL)
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM newsletter_issues")
            count = cur.fetchone()[0]
            if count > 0:
                print(f"Already have {count} issues. Skipping seed.")
                return

            for issue in ISSUES:
                cur.execute(
                    """INSERT INTO newsletter_issues (date, title, tldr, tags, certs, body)
                    VALUES (%s, %s, %s, %s, %s, %s)""",
                    (issue["date"], issue["title"], issue["tldr"],
                     issue["tags"], issue["certs"], ""),
                )
            conn.commit()
            print(f"Seeded {len(ISSUES)} issues.")
    finally:
        conn.close()

if __name__ == "__main__":
    seed()
