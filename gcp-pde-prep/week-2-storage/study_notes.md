# Week 2 — Storage & Databases

**Goal**: Master the GCP storage services you don't use daily.
**Time**: ~7 hours (1-2h/day)
**Adjust**: After your week 1 gap analysis, skip topics you rated ✅ and focus on ⚠️ and ❌.

---

## Day 1-2: Bigtable (2-3 hours)

### What to study
- Architecture: tablets, nodes, Colossus, LSM tree
- Row key design: why it matters, hot-spotting, common patterns
  - Good: reverse timestamp, hash prefix
  - Bad: sequential IDs, monotonically increasing keys
- Column families: grouping related data
- Performance: when to add nodes, SSD vs HDD
- Use cases: time-series, IoT, analytics with high read/write throughput
- When to use Bigtable vs BigQuery vs Spanner

### Key exam concepts
- Bigtable is NOT good for: transactions, SQL queries, small datasets (<1TB)
- Bigtable IS good for: >1TB, low-latency reads/writes, time-series, IoT
- Row key design is the #1 performance factor
- You can read from Bigtable in Dataflow using BigtableIO

### Study resources
- GCP docs: "Bigtable overview" and "Schema design"
- Cloud Skills Boost: Bigtable lab
- YouTube: "Bigtable schema design best practices" (Google Cloud channel)

### My notes
_(fill in as you study)_

---

## Day 2-3: Cloud Spanner (2 hours)

### What to study
- Architecture: TrueTime, global strong consistency
- When to choose Spanner: global distribution + relational + transactions
- Schema design: interleaved tables, primary key selection
- Avoid: sequential primary keys (causes hotspots, like Bigtable)
- Cost model: node-hours (expensive — exam asks when it's justified)
- Spanner vs Cloud SQL: scale, global distribution, cost

### Key exam concepts
- Spanner = "relational + global + strongly consistent + horizontally scalable"
- Use Spanner when: need global transactions, >10TB relational data, horizontal scaling
- Use Cloud SQL when: single-region, <10TB, cost-sensitive
- Spanner supports SQL (ANSI 2011)

### Study resources
- GCP docs: "Spanner overview" and "Schema design best practices"
- YouTube: "When to use Cloud Spanner" (Google Cloud channel)

### My notes
_(fill in as you study)_

---

## Day 3-4: Dataproc (1-2 hours)

### What to study
- What it is: managed Spark/Hadoop on GCP
- When to use vs Dataflow:
  - Dataproc: existing Spark/Hadoop code, need Spark ML, complex batch
  - Dataflow: new pipelines, streaming, Apache Beam, serverless
- Cluster types: standard, single-node, high-availability
- Autoscaling and preemptible/spot workers
- Dataproc Serverless: no cluster management
- Integration: reads/writes to BigQuery, GCS, Bigtable
- Ephemeral clusters: spin up, process, tear down (exam loves this pattern)

### Key exam concepts
- "Migrate existing Spark jobs" → Dataproc
- "New streaming pipeline" → Dataflow
- Store data in GCS, not HDFS (separation of compute and storage)
- Use ephemeral clusters to save cost
- Dataproc Serverless = no cluster management (like Dataflow for Spark)

### Study resources
- GCP docs: "Dataproc overview"
- YouTube: "Dataflow vs Dataproc" (Google Cloud channel)

### My notes
_(fill in as you study)_

---

## Day 5: Data Catalog / Dataplex (1 hour)

### What to study
- Data Catalog: metadata management, search, tag templates
- Dataplex: data lake management, data quality, data lineage
- When the exam mentions "metadata discovery" → Data Catalog
- When the exam mentions "data quality rules" → Dataplex
- Policy tags for column-level security in BigQuery

### Key exam concepts
- Data Catalog auto-discovers metadata from BigQuery, Pub/Sub, GCS
- Policy tags = column-level access control in BigQuery
- Dataplex organizes data across GCS and BigQuery into "lakes" and "zones"

### Study resources
- GCP docs: "Data Catalog overview", "Dataplex overview"

### My notes
_(fill in as you study)_

---

## Day 5: Cloud SQL vs AlloyDB (30 min)

### What to study
- Cloud SQL: managed MySQL/PostgreSQL/SQL Server
- AlloyDB: PostgreSQL-compatible, better performance, Columnar Engine
- When to use AlloyDB: need PostgreSQL but with better analytics performance
- Migration: Database Migration Service (DMS) for moving to Cloud SQL/AlloyDB

### Key exam concepts
- "Migrate on-prem PostgreSQL to GCP" → Cloud SQL or AlloyDB (via DMS)
- AlloyDB = "PostgreSQL but faster" (especially for mixed OLTP+OLAP)

### My notes
_(fill in as you study)_

---

## Week 2 Checklist

- [ ] Studied Bigtable architecture and schema design
- [ ] Studied Spanner architecture and when to use it
- [ ] Studied Dataproc vs Dataflow decision criteria
- [ ] Studied Data Catalog and Dataplex basics
- [ ] Studied Cloud SQL vs AlloyDB
- [ ] Built the services comparison cheatsheet
- [ ] Can confidently answer "which storage for which use case"
