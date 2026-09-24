# Cheatsheet: GCP Data Services Comparison

## The Big Decision Matrix — "Which Service Should I Use?"

### Storage & Databases

| Need | Service | Why |
|------|---------|-----|
| SQL analytics on large datasets | **BigQuery** | Serverless, columnar, optimized for analytics |
| Low-latency NoSQL, >1TB, high throughput | **Bigtable** | Wide-column, single-digit ms latency, scales to PB |
| Global relational + strong consistency | **Spanner** | TrueTime, horizontal scaling, SQL support |
| Standard relational, single-region | **Cloud SQL** | Managed MySQL/PostgreSQL/SQL Server |
| PostgreSQL with better analytics perf | **AlloyDB** | Columnar engine, PostgreSQL-compatible |
| Document/key-value, <1TB, serverless | **Firestore** | Serverless, real-time sync, mobile/web |
| Object storage (files, backups, data lake) | **Cloud Storage** | Cheap, durable, lifecycle management |
| In-memory caching | **Memorystore** | Managed Redis/Memcached |

### Processing

| Need | Service | Why |
|------|---------|-----|
| New streaming/batch pipeline | **Dataflow** | Serverless, Apache Beam, exactly-once |
| Existing Spark/Hadoop jobs | **Dataproc** | Managed clusters, bring existing code |
| Visual ETL (non-developers) | **Data Fusion** | Drag-and-drop, based on CDAP |
| SQL transformations | **BigQuery** | SQL-native, scheduled queries |
| Orchestration | **Composer** | Managed Airflow, DAG-based |

### ML / AI

| Need | Service | Why |
|------|---------|-----|
| ML with SQL (data already in BigQuery) | **BigQuery ML** | CREATE MODEL with SQL |
| AutoML (no code) | **Vertex AI AutoML** | Vision, text, tabular, video |
| Custom models (TF/PyTorch) | **Vertex AI Custom** | Managed training infrastructure |
| Feature management | **Vertex AI Feature Store** | Avoid training-serving skew |

### Ingestion

| Need | Service | Why |
|------|---------|-----|
| Real-time event streaming | **Pub/Sub** | Serverless, global, at-least-once |
| Scheduled data transfers (SaaS) | **BigQuery Data Transfer** | Google Ads, YouTube, S3, etc. |
| Large file transfers | **Storage Transfer Service** | Cross-cloud, scheduled |
| Massive offline transfer (PB) | **Transfer Appliance** | Physical device shipped to Google |
| Database replication | **Database Migration Service** | MySQL/PostgreSQL CDC |

---

## Head-to-Head Comparisons

### BigQuery vs Bigtable

| Aspect | BigQuery | Bigtable |
|--------|----------|----------|
| Query language | SQL | NoSQL (row key lookups) |
| Latency | Seconds | Milliseconds |
| Best for | Analytics, reporting, ML | Real-time serving, time-series, IoT |
| Pricing | Per query (on-demand) or slots | Per node-hour |
| Schema | Structured (tables) | Wide-column (row key + column families) |
| Scale | Petabytes | Petabytes |
| Joins | Yes | No |
| Transactions | Limited (DML) | Single-row atomic |

**Exam shortcut**: "Low-latency reads/writes" → Bigtable. "Complex analytics/SQL" → BigQuery.

### Spanner vs Cloud SQL

| Aspect | Spanner | Cloud SQL |
|--------|---------|-----------|
| Scale | Horizontal (unlimited) | Vertical (limited) |
| Distribution | Global | Single region (+ read replicas) |
| Consistency | Strong (global) | Strong (single region) |
| Cost | High ($$$) | Low-moderate |
| Use when | >10TB, global, transactions | <10TB, single-region, cost-sensitive |

**Exam shortcut**: "Global + relational + transactions" → Spanner. Everything else → Cloud SQL.

### Dataflow vs Dataproc

| Aspect | Dataflow | Dataproc |
|--------|----------|----------|
| Model | Apache Beam | Spark / Hadoop |
| Management | Fully serverless | Managed clusters |
| Best for | New pipelines, streaming | Existing Spark/Hadoop code |
| Streaming | Native, exactly-once | Spark Streaming |
| Autoscaling | Automatic | Configurable |
| Cost model | Per worker-hour | Per cluster-hour |

**Exam shortcut**: "New pipeline" → Dataflow. "Migrate existing Spark" → Dataproc.

### Dataflow vs Data Fusion

| Aspect | Dataflow | Data Fusion |
|--------|----------|-------------|
| Users | Developers | Non-developers |
| Interface | Code (Beam SDK) | Visual (drag-and-drop) |
| Streaming | Full support | Limited |
| Scale | Very high throughput | Moderate |
| Underlying | Dataflow workers | Dataproc clusters |

**Exam shortcut**: "Non-technical users" → Data Fusion. "High-throughput streaming" → Dataflow.

---

## Cloud Storage Classes

| Class | Min Duration | Use Case | Relative Cost |
|-------|-------------|----------|---------------|
| Standard | None | Frequent access | $$$$ |
| Nearline | 30 days | Monthly access | $$$ |
| Coldline | 90 days | Quarterly access | $$ |
| Archive | 365 days | Yearly access / compliance | $ |

**Exam shortcut**: "Accessed once a month" → Nearline. "Compliance archive" → Archive. "Active data lake" → Standard.

---

## BigQuery Optimization Quick Reference

| Technique | What it does | When to use |
|-----------|-------------|-------------|
| Partitioning | Divides table by date/integer/ingestion time | Always on large tables |
| Clustering | Sorts data within partitions by up to 4 columns | Frequent filters on specific columns |
| Materialized views | Pre-computes aggregations | Repeated dashboard queries |
| BI Engine | In-memory acceleration | Looker/Data Studio dashboards |
| Flat-rate pricing | Fixed slots instead of per-query | Predictable, high query volume |
| Long-term storage | Auto discount after 90 days | All tables (automatic) |
