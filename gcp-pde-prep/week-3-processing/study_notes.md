# Week 3 — Processing & ML

**Goal**: Cover ML on GCP and lesser-used processing services.
**Time**: ~7 hours (1-2h/day)
**Adjust**: After your week 1 gap analysis, skip topics you rated ✅ and focus on ⚠️ and ❌.

---

## Day 1-2: BigQuery ML (2 hours)

### What to study
- CREATE MODEL syntax and supported model types:
  - Linear regression, logistic regression
  - K-means clustering
  - Matrix factorization (recommendations)
  - Time-series (ARIMA_PLUS)
  - Boosted trees (XGBoost)
  - Deep neural networks
  - Imported TensorFlow models
- ML.EVALUATE: how to check model performance
- ML.PREDICT: running predictions
- ML.TRANSFORM: feature preprocessing
- ML.FEATURE_INFO: feature importance
- When to use BigQuery ML vs Vertex AI:
  - BigQuery ML: SQL users, quick models, data already in BigQuery
  - Vertex AI: custom models, advanced ML, AutoML, production serving

### Key exam concepts
- BigQuery ML lets you train models WITH SQL (no Python needed)
- Exam loves: "the data team knows SQL but not Python, how to build a model?" → BigQuery ML
- For recommendations → matrix factorization
- For forecasting → ARIMA_PLUS
- For classification → logistic regression or boosted trees

### Example syntax to know
```sql
CREATE OR REPLACE MODEL `project.dataset.model_name`
OPTIONS(model_type='logistic_reg', input_label_cols=['label']) AS
SELECT * FROM `project.dataset.training_data`;

SELECT * FROM ML.PREDICT(MODEL `project.dataset.model_name`,
  (SELECT * FROM `project.dataset.new_data`));
```

### My notes
_(fill in as you study)_

---

## Day 2-3: Vertex AI Basics (2 hours)

### What to study
- AutoML: train models without code (vision, text, tabular, video)
- Custom training: bring your own code (TensorFlow, PyTorch, scikit-learn)
- Feature Store: centralized feature management, avoid training-serving skew
- Model Registry: version and manage models
- Endpoints: deploy models for online prediction
- Batch prediction: large-scale offline predictions
- Model monitoring: detect data drift, feature skew
- Pipelines: orchestrated ML workflows (Kubeflow-based)

### Key exam concepts
- "No ML expertise, need to train a model" → AutoML
- "Custom TensorFlow model" → Custom training on Vertex AI
- "Feature consistency between training and serving" → Feature Store
- "Monitor model performance in production" → Model monitoring
- AutoML vs BigQuery ML: AutoML is more powerful but doesn't require SQL knowledge

### My notes
_(fill in as you study)_

---

## Day 3-4: Data Fusion (1 hour)

### What to study
- What it is: visual ETL tool (based on CDAP — open source)
- Drag-and-drop pipeline builder
- When to use: non-developers building ETL, quick data integration
- When NOT to use: complex streaming, high-throughput (use Dataflow instead)
- Editions: Basic, Developer, Enterprise
- Integration with BigQuery, GCS, Cloud SQL, on-prem databases

### Key exam concepts
- "Citizen data integrators" or "non-technical users building pipelines" → Data Fusion
- "Complex streaming at scale" → Dataflow (not Data Fusion)
- Data Fusion runs on Dataproc under the hood
- Enterprise edition adds: replication, lineage, and metadata

### My notes
_(fill in as you study)_

---

## Day 4: Data Loss Prevention — DLP (1.5 hours)

### What to study
- What it is: discover, classify, and protect sensitive data
- Inspection: scan data for PII (names, emails, credit cards, etc.)
- InfoTypes: built-in detectors for common PII patterns
- De-identification techniques:
  - Masking: replace characters (e.g., `****@email.com`)
  - Tokenization: replace with surrogate value
  - Bucketing: replace with ranges
  - Date shifting: shift dates by random amount
  - Crypto-based: deterministic encryption, format-preserving encryption
- Re-identification: reverse tokenization with key
- Integration: BigQuery, GCS, Datastore, Dataflow
- DLP + Dataflow: inspect/de-identify data in streaming pipelines

### Key exam concepts
- "Remove PII from data before analysis" → DLP de-identification
- "Find sensitive data in BigQuery" → DLP inspection job
- "GDPR compliance, anonymize user data" → DLP
- Tokenization is reversible (with key), masking is not
- Format-preserving encryption keeps data format (useful for testing)

### My notes
_(fill in as you study)_

---

## Day 5: Advanced Dataflow (1.5 hours)

### What to study (beyond what you already know)
- Dataflow Templates:
  - Classic templates: pre-compiled, limited parameters
  - Flex Templates: containerized, custom parameters, more flexible
- Streaming modes:
  - Exactly-once (default in Dataflow)
  - At-least-once (lower latency option)
- Dataflow Shuffle Service: offload shuffle to managed service
- Dataflow Streaming Engine: separate compute from state storage
- Dataflow Prime: advanced autoscaling with right-fitting
- Update strategies: in-place update vs drain and restart
- Cross-language transforms: use Java transforms in Python pipelines

### Key exam concepts
- "Deploy pipelines that operations team can run with parameters" → Flex Templates
- "Update a streaming pipeline without data loss" → in-place update (compatible changes)
- "Reduce shuffle bottleneck" → enable Shuffle Service
- Exactly-once is default; at-least-once is optional for lower latency

### My notes
_(fill in as you study)_

---

## Week 3 Checklist

- [ ] Studied BigQuery ML model types and syntax
- [ ] Studied Vertex AI components (AutoML, Feature Store, monitoring)
- [ ] Studied Data Fusion use cases and limitations
- [ ] Studied DLP inspection and de-identification techniques
- [ ] Studied advanced Dataflow features (templates, streaming modes)
- [ ] Can answer "which ML approach for which scenario" confidently
