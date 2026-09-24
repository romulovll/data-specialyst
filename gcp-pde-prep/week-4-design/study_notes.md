# Week 4 — Design & Security

**Goal**: System design questions and security best practices.
**Time**: ~7 hours (1-2h/day)
**Adjust**: After your week 1 gap analysis, skip topics you rated ✅ and focus on ⚠️ and ❌.

---

## Day 1: Migration Strategies (1.5 hours)

### What to study
- Migration types the exam covers:
  - On-prem data warehouse → BigQuery
  - On-prem Hadoop → Dataproc or Dataflow
  - On-prem databases → Cloud SQL / Spanner / AlloyDB
  - File-based data → Cloud Storage
- Transfer tools:
  - **gsutil**: command-line, small to medium transfers
  - **Storage Transfer Service**: scheduled, large-scale, cross-cloud (S3 → GCS)
  - **Transfer Appliance**: physical device for massive data (petabytes, slow network)
  - **Database Migration Service (DMS)**: MySQL/PostgreSQL to Cloud SQL/AlloyDB
  - **BigQuery Data Transfer Service**: SaaS → BigQuery (Google Ads, YouTube, etc.)
- Migration patterns:
  - Lift and shift: move as-is
  - Modernize: re-architect during migration
  - Hybrid: keep some on-prem during transition

### Key exam concepts
- "Petabytes of data, slow internet" → Transfer Appliance
- "Migrate from AWS S3" → Storage Transfer Service
- "Migrate MySQL to Cloud SQL with minimal downtime" → DMS with continuous replication
- "Migrate Hadoop to GCP" → Dataproc (if keeping Spark) or Dataflow (if re-architecting)
- Always prefer GCS over HDFS for Dataproc storage (separation of compute and storage)

### My notes
_(fill in as you study)_

---

## Day 2: Cost Optimization (1.5 hours)

### What to study
- **BigQuery cost optimization**:
  - On-demand vs flat-rate (editions: Standard, Enterprise, Enterprise Plus)
  - Slot reservations and autoscaling
  - Partitioning: reduces data scanned → reduces cost
  - Clustering: improves query performance on partitioned tables
  - Materialized views: pre-computed aggregations
  - BI Engine: in-memory acceleration for dashboards
  - Storage pricing: active vs long-term (>90 days = 50% cheaper)
  - Query best practices: avoid SELECT *, use LIMIT with caution
- **Dataflow cost optimization**:
  - Autoscaling: let Dataflow manage workers
  - Right-sizing: choose appropriate machine types
  - Streaming Engine: reduces cost for streaming jobs
  - FlexRS (Flexible Resource Scheduling): batch jobs at lower cost
- **General GCP cost optimization**:
  - Committed use discounts
  - Preemptible/Spot VMs for Dataproc
  - Cloud Storage lifecycle policies (auto-downgrade storage class)
  - Ephemeral Dataproc clusters (spin up, process, tear down)

### Key exam concepts
- "Reduce BigQuery costs" → partitioning + clustering + flat-rate if predictable
- "Reduce Dataflow batch costs" → FlexRS
- "Reduce Dataproc costs" → preemptible workers + ephemeral clusters
- "Data accessed rarely" → Nearline/Coldline/Archive storage classes

### My notes
_(fill in as you study)_

---

## Day 3: Security & IAM (1.5 hours)

### What to study
- **IAM best practices**:
  - Principle of least privilege
  - Service accounts for applications (not user accounts)
  - Predefined roles vs custom roles
  - Organization, folder, project hierarchy
  - Key roles to know: BigQuery Data Viewer/Editor/Owner, Dataflow Developer/Worker
- **Encryption**:
  - Default encryption: Google-managed keys (always on)
  - CMEK (Customer-Managed Encryption Keys): you control key rotation in Cloud KMS
  - CSEK (Customer-Supplied Encryption Keys): you provide the key, Google doesn't store it
  - When to use each: default (most cases), CMEK (compliance), CSEK (maximum control)
- **VPC Service Controls**:
  - Creates a security perimeter around GCP services
  - Prevents data exfiltration (e.g., BigQuery data can't be copied to external project)
  - Exam loves this for "prevent data leaving the organization"
- **Column-level security in BigQuery**:
  - Policy tags in Data Catalog
  - Dynamic data masking

### Key exam concepts
- "Prevent data exfiltration" → VPC Service Controls
- "Customer must control encryption keys" → CMEK
- "Customer must provide keys and Google can't access them" → CSEK
- "Restrict access to specific columns in BigQuery" → policy tags
- "Service-to-service authentication" → service accounts with minimal roles

### My notes
_(fill in as you study)_

---

## Day 4: Reliability & DR (1 hour)

### What to study
- **BigQuery**: multi-region datasets, automatic replication, no DR needed
- **Bigtable**: replication across zones/regions, automatic failover
- **Spanner**: multi-region configurations, automatic failover
- **Cloud SQL**: HA configuration (regional), cross-region read replicas
- **GCS**: multi-region and dual-region buckets
- **Dataflow**: built-in checkpointing for streaming, resume on failure
- **Composer/Airflow**: multi-zone, HA configurations
- Backup strategies: BigQuery snapshots, Cloud SQL backups, export to GCS

### Key exam concepts
- "Zero RPO for relational data" → Spanner (multi-region)
- "HA for PostgreSQL" → Cloud SQL HA or AlloyDB
- "Disaster recovery for BigQuery" → multi-region dataset (US, EU)
- "Resume streaming pipeline after failure" → Dataflow checkpointing (automatic)

### My notes
_(fill in as you study)_

---

## Day 5: Data Governance & Compliance (1.5 hours)

### What to study
- **Data governance principles**: ownership, quality, lineage, cataloging
- **Data Catalog**: search, discover, tag metadata
- **Dataplex**: manage data lakes, define quality rules, auto-discover
- **Data lineage**: track where data comes from and flows to
- **GDPR / data privacy on GCP**:
  - Right to erasure → design pipelines to delete user data
  - Data residency → control where data is stored (regions)
  - Consent management → track user consent
  - Pseudonymization → DLP for de-identification
- **Audit logging**: Cloud Audit Logs, access transparency
- **Data retention**: lifecycle policies, BigQuery table expiration

### Key exam concepts
- "Track where data comes from" → data lineage (Dataplex)
- "User requests data deletion (GDPR)" → design for record-level deletion
- "Audit who accessed what data" → Cloud Audit Logs
- "Classify and discover data assets" → Data Catalog
- BigQuery supports record-level DML DELETE for GDPR compliance

### My notes
_(fill in as you study)_

---

## Week 4 Checklist

- [ ] Studied migration strategies and transfer tools
- [ ] Studied cost optimization for BigQuery, Dataflow, Dataproc
- [ ] Studied IAM, encryption (CMEK/CSEK), VPC Service Controls
- [ ] Studied reliability and DR patterns for each service
- [ ] Studied data governance, compliance, and audit logging
- [ ] Built the security & governance cheatsheet
