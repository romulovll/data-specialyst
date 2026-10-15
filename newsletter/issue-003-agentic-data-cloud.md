# Cloud Decoded #003 — BigQuery Became a Lakehouse. And It Talks to AWS.

> **TL;DR:** Google launched the "Agentic Data Cloud" — a fancy name for: BigQuery is now a cross-cloud lakehouse with zero-copy access to data in AWS S3 and Azure. Plus, a new "Knowledge Catalog" that gives AI agents context about your data. Your data architecture just got simpler.

---

## What Google Announced (Next '26, April 2026)

Google introduced the **Agentic Data Cloud** — a new AI-native data architecture with three key pieces:
1. A cross-cloud lakehouse (BigQuery reads from S3 and Azure without copying)
2. Knowledge Catalog (maps business meaning across your data)
3. Data agents (AI agents that do data science for you)

---

## In Plain Language

**Before:** Your data lives in GCP. Your partner's data lives in AWS. To analyze both, you copy everything into BigQuery. Costs money, takes time, stale data.

**After:** BigQuery reads directly from S3 and Azure — zero copy. The data stays where it is. You query it with SQL as if it were local.

And the Knowledge Catalog? Think of it as a **data dictionary on steroids** — it doesn't just list your tables, it understands what the data *means* so AI agents can use it correctly.

---

## The 3 Big Features

### 1. Cross-Cloud Lakehouse

```sql
-- Query data sitting in AWS S3, directly from BigQuery
-- No data movement. No ETL. Zero copy.

CREATE EXTERNAL TABLE my_dataset.aws_sales
WITH CONNECTION `my-aws-connection`
OPTIONS (
  format = 'ICEBERG',
  uris = ['s3://partner-bucket/sales/']
);

-- Now join it with your GCP data
SELECT 
  gcp.customer_id,
  aws.revenue,
  gcp.segment
FROM my_dataset.customers AS gcp
JOIN my_dataset.aws_sales AS aws
  ON gcp.customer_id = aws.customer_id
```

**Why it matters:** Multi-cloud data architecture without the ETL tax.

### 2. Knowledge Catalog

The old Data Catalog told you: "This table exists, it has these columns."

The Knowledge Catalog tells you: "This table contains quarterly revenue data. The `amount` column is in USD. The `region` column uses ISO 3166-1 codes. This data is refreshed daily at 6 AM UTC and is owned by the finance team."

**Why it matters:** When an AI agent needs to answer "What were Q3 sales in Europe?", the Knowledge Catalog tells it exactly which table to query and how to interpret the results. Without this, agents hallucinate.

### 3. Data Science Agent

```
You: "Find the top 3 factors driving customer churn in the last quarter"

Agent:
1. Loaded data from customer_events and subscriptions tables
2. Cleaned 12,847 null values in the engagement_score column
3. Ran correlation analysis across 23 features
4. Built a quick classification model
5. Top factors: days_since_last_login (0.73), support_tickets (0.61), plan_downgrades (0.58)
6. Visualization saved to your notebook
```

All in BigQuery. No Python. No Jupyter setup. Just ask.

---

## Two More Game-Changers

### Reverse ETL (BigQuery → Spanner/AlloyDB)

```sql
-- One-click: push BigQuery analytics back to your operational database
EXPORT DATA
  OPTIONS (
    uri = 'spanner://my-instance/my-db/customer_scores',
    format = 'SPANNER'
  )
AS
SELECT customer_id, churn_score, next_best_action
FROM ml_results.customer_predictions
WHERE prediction_date = CURRENT_DATE()
```

**Before:** Build a Dataflow pipeline to move data from BigQuery to Spanner. Maintain it forever.
**After:** One SQL statement. Scheduled. Done.

### BigQuery Fluid Scaling

Old pricing: Reserve 100 slots. Pay for 100 even if you use 10.

New pricing: **Per-second billing**. Use 10 slots for 5 minutes, then burst to 500 for 30 seconds, then back to 10. Pay exactly for what you use.

**Who wins:** Agentic workloads. Agents are unpredictable — they might fire 50 queries in a second, then nothing for an hour. Fluid scaling makes this affordable.

---

## Why This Matters For You

### If you're a Data Architect:
Your reference architecture just simplified. The "data integration layer" shrinks dramatically:
- Cross-cloud data? → Zero-copy lakehouse (no ETL)
- Push analytics to operational systems? → Reverse ETL (one SQL)
- Data catalog? → Knowledge Catalog (AI-native)

### If you're studying for GCP certification:
New exam topics: "Agentic Data Cloud," "Knowledge Catalog," "cross-cloud lakehouse," "Reverse ETL." These WILL appear on updated exams.

### If you're a Data Engineer:
Some of your pipelines might become unnecessary. If you maintain ETL jobs that copy data from S3 to BigQuery, the cross-cloud lakehouse replaces them. Check if any of your current work can be simplified.

---

## One-Liner Takeaway

> BigQuery now reads from S3 and Azure without copying data. Your multi-cloud architecture just lost half its pipelines.

---

*Cloud Decoded — Google Cloud announcements, decoded for practitioners. By [Romulo Leao](https://romulovll.github.io/data-specialyst/).*
