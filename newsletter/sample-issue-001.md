# Cloud Decoded #001 — BigQuery Now Speaks AI Natively

> **TL;DR:** BigQuery just got AI superpowers. You can now run sentiment analysis, translate text, and generate embeddings — all with a simple SQL query. No Python. No Vertex AI pipeline. Just SQL.

---

## What Google Announced

BigQuery released `AI.GENERATE`, `AI.EMBED`, and `AI.SIMILARITY` — functions that let you call Gemini models directly from SQL.

**The official announcement says:**
> "AI.GENERATE and AI.GENERATE_TABLE accept any input type: text, images, videos, audio, and documents, and support multiple AI/ML tasks in a single function call."

Sounds fancy. But what does it actually mean for you?

---

## In Plain Language

Before this update, if you wanted to analyze the sentiment of 1 million customer reviews in BigQuery, you had to:

1. Export data from BigQuery
2. Write a Python script
3. Call Vertex AI or OpenAI API
4. Handle batching, retries, rate limits
5. Load results back into BigQuery

**Now?** One SQL query. Done.

---

## Real Example: Analyze Customer Feedback

Imagine you have a table `customer_reviews` with columns `review_id`, `text`, and `product_name`.

### Before (the old way)
```python
# Export from BigQuery
# pip install google-cloud-aiplatform
# Write 50 lines of Python
# Handle pagination
# Load back into BigQuery
# Takes: 2-3 hours of work
```

### After (the new way)
```sql
SELECT
  review_id,
  product_name,
  text,
  AI.GENERATE(
    CONCAT('Analyze this review and return: 
      1) sentiment (positive/negative/neutral)
      2) main topic
      3) one-line summary in English'),
    text,
    output_schema => STRUCT<
      sentiment STRING,
      topic STRING,
      summary STRING
    >
  ).*
FROM `my_project.analytics.customer_reviews`
WHERE DATE(created_at) = CURRENT_DATE()
```

**That's it.** One query. Structured output. No Python. Runs at BigQuery scale.

---

## Why This Matters For You

### If you're a Data Engineer:
Your data pipeline just got simpler. Instead of maintaining a separate ML service for text processing, you can do it inline in your ELT pipeline. Less infra, less code, less maintenance.

### If you're a Data Architect:
This changes your architecture. You no longer need a separate "ML processing" layer for basic AI tasks. BigQuery becomes your processing AND intelligence layer. Simpler architecture = lower cost = fewer failure points.

### If you're preparing for the GCP exam:
This is the evolution of BigQuery ML. The exam already tests when to use BigQuery ML vs Vertex AI. Now there's a third option: **BigQuery AI functions** — for when you need AI on your data but don't need to train a model.

**Decision tree:**
- Need to TRAIN a custom model → **Vertex AI**
- Need to TRAIN with SQL → **BigQuery ML**
- Need to USE a pre-trained model on your data → **BigQuery AI functions** (NEW)

---

## Try It Yourself (5 minutes)

```sql
-- Use a public dataset to test AI.GENERATE
-- No setup needed — just run this in BigQuery console

SELECT
  title,
  AI.GENERATE(
    'Classify this article title as: tech, politics, sports, or business. Return only the category.',
    title
  ) AS category
FROM `bigquery-public-data.hacker_news.stories`
WHERE score > 100
LIMIT 10
```

---

## One-Liner Takeaway

> BigQuery AI functions = "Hey Gemini, analyze this column" — in SQL. No pipelines, no Python, no infra.

---

*Cloud Decoded is a weekly newsletter that takes Google Cloud announcements and translates them into practical examples you can use today. Built by [Romulo Leao](https://romulovll.github.io/data-specialyst/), Data Architect.*
