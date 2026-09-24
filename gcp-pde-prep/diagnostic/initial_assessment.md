# Self-Assessment Checklist — GCP Professional Data Engineer

Completed: 2026-09-16

Rating legend:
- ✅ **Confident** — I can explain this and answer exam questions correctly
- ⚠️ **Partial** — I know the basics but not exam-level depth
- ❌ **Don't know** — Need to study this

---

## Domain 1: Designing Data Processing Systems (22%)

### Data Pipeline Architecture
| # | Topic | Rating | Notes |
|---|-------|--------|-------|
| 1 | Designing batch vs streaming pipelines | ✅ | Confident |
| 2 | Choosing between Dataflow, Dataproc, and Data Fusion | ❌ | Need to study decision criteria |
| 3 | Designing for exactly-once vs at-least-once processing | ❌ | Need to study |
| 4 | Windowing strategies (fixed, sliding, session, global) | ❌ | Need to study |
| 5 | Watermarks and late data handling | ❌ | Need to study |
| 6 | Pipeline orchestration with Composer/Airflow | ✅ | Confident |

### Data Storage Design
| # | Topic | Rating | Notes |
|---|-------|--------|-------|
| 7 | Choosing between BigQuery, Bigtable, Spanner, Cloud SQL | ✅ | Confident |
| 8 | BigQuery partitioning strategies (time, range, ingestion) | ❌ | Need to study |
| 9 | BigQuery clustering and when to use it | ❌ | Need to study |
| 10 | Bigtable schema design (row key, column families) | ❌ | Need to study |
| 11 | Spanner schema design and interleaved tables | ❌ | Need to study |
| 12 | Cloud Storage classes (Standard, Nearline, Coldline, Archive) | ❌ | Need to study |
| 13 | Data lake vs data warehouse architecture | ❌ | Need to study |

### System Design
| # | Topic | Rating | Notes |
|---|-------|--------|-------|
| 14 | Designing for scalability and high availability | ❌ | Need to study |
| 15 | Designing for data consistency vs availability trade-offs | ❌ | Need to study |
| 16 | Multi-region data architecture | ❌ | Need to study |
| 17 | Hybrid and multi-cloud data architectures | ❌ | Need to study |
| 18 | Designing for cost optimization | ❌ | Need to study |

---

## Domain 2: Ingesting and Processing Data (25%)

### Data Ingestion
| # | Topic | Rating | Notes |
|---|-------|--------|-------|
| 19 | Pub/Sub: topics, subscriptions, push vs pull | ✅ | Confident |
| 20 | Pub/Sub: ordering, deduplication, dead-letter topics | ❌ | Need to study |
| 21 | Pub/Sub Lite vs Pub/Sub: when to use each | ❌ | Need to study |
| 22 | Streaming ingestion patterns | ❌ | Need to study |
| 23 | Batch ingestion patterns (Transfer Service, gsutil) | ❌ | Need to study |
| 24 | Change Data Capture (CDC) patterns | ❌ | Need to study |
| 25 | IoT Core and IoT data ingestion | ❌ | Need to study |

### Data Processing — Dataflow
| # | Topic | Rating | Notes |
|---|-------|--------|-------|
| 26 | Apache Beam programming model (PCollections, transforms) | ❌ | Need exam-level depth |
| 27 | ParDo, GroupByKey, CoGroupByKey, Combine | ❌ | Need exam-level depth |
| 28 | Side inputs and side outputs | ❌ | Need exam-level depth |
| 29 | Dataflow templates vs Flex Templates | ❌ | Need to study |
| 30 | Dataflow autoscaling and worker configuration | ❌ | Need to study |
| 31 | Dataflow streaming vs batch execution | ❌ | Need to study |
| 32 | Dataflow monitoring and troubleshooting | ❌ | Need to study |
| 33 | Dataflow shuffle service and streaming engine | ❌ | Need to study |

### Data Processing — Other
| # | Topic | Rating | Notes |
|---|-------|--------|-------|
| 34 | Dataproc: Spark and Hadoop on GCP | ❌ | Need to study |
| 35 | Dataproc: cluster configuration, autoscaling, preemptible VMs | ❌ | Need to study |
| 36 | Dataproc Serverless vs standard clusters | ❌ | Need to study |
| 37 | Data Fusion: visual ETL pipelines | ❌ | Need to study |
| 38 | BigQuery: loading data (batch, streaming, DML, Storage Write API) | ❌ | Need to study |
| 39 | BigQuery: query optimization (slots, BI Engine, materialized views) | ❌ | Need to study |

---

## Domain 3: Storing Data (20%)

### Relational Databases
| # | Topic | Rating | Notes |
|---|-------|--------|-------|
| 40 | Cloud SQL: configuration, HA, read replicas | ❌ | Need to study |
| 41 | Cloud Spanner: architecture, TrueTime, global distribution | ❌ | Need to study |
| 42 | AlloyDB: when to use vs Cloud SQL | ❌ | Need to study |
| 43 | Database migration strategies (DMS, Migrate for MySQL/PostgreSQL) | ❌ | Need to study |

### NoSQL & Analytics
| # | Topic | Rating | Notes |
|---|-------|--------|-------|
| 44 | Bigtable: architecture (tablets, nodes, SSDs vs HDDs) | ❌ | Need to study |
| 45 | Bigtable: performance optimization and monitoring | ❌ | Need to study |
| 46 | Firestore/Datastore: document model, when to use | ❌ | Need to study |
| 47 | Memorystore (Redis/Memcached): caching patterns | ❌ | Need to study |
| 48 | BigQuery: storage architecture (Capacitor, Colossus) | ❌ | Need to study |
| 49 | BigQuery: external tables, federated queries | ❌ | Need to study |

### Object Storage
| # | Topic | Rating | Notes |
|---|-------|--------|-------|
| 50 | Cloud Storage: lifecycle policies, retention, object versioning | ❌ | Need to study |
| 51 | Cloud Storage: signed URLs, ACLs vs IAM | ❌ | Need to study |
| 52 | Transfer Service and Transfer Appliance | ❌ | Need to study |

---

## Domain 4: Preparing and Using Data for Analysis (15%)

### Data Preparation
| # | Topic | Rating | Notes |
|---|-------|--------|-------|
| 53 | Dataprep (Trifacta): interactive data cleaning | ❌ | Need to study |
| 54 | BigQuery: UDFs (SQL and JavaScript) | ❌ | Need to study |
| 55 | BigQuery: scripting and stored procedures | ❌ | Need to study |
| 56 | Data quality validation strategies | ❌ | Need to study |

### Machine Learning on GCP
| # | Topic | Rating | Notes |
|---|-------|--------|-------|
| 57 | BigQuery ML: CREATE MODEL, supported algorithms | ❌ | Need to study |
| 58 | BigQuery ML: TRANSFORM, EVALUATE, PREDICT | ❌ | Need to study |
| 59 | Vertex AI: AutoML vs custom training | ❌ | Need to study |
| 60 | Vertex AI: Feature Store | ❌ | Need to study |
| 61 | Vertex AI: Model monitoring and drift detection | ❌ | Need to study |
| 62 | TensorFlow/PyTorch on GCP (high-level concepts) | ❌ | Need to study |

### Analytics & Visualization
| # | Topic | Rating | Notes |
|---|-------|--------|-------|
| 63 | Looker and Looker Studio (Data Studio) | ❌ | Need to study |
| 64 | BigQuery BI Engine | ❌ | Need to study |
| 65 | Connected Sheets (BigQuery + Google Sheets) | ❌ | Need to study |

---

## Domain 5: Maintaining and Automating Data Workloads (18%)

### Operations & Monitoring
| # | Topic | Rating | Notes |
|---|-------|--------|-------|
| 66 | Cloud Monitoring: metrics, alerts, dashboards | ❌ | Need to study |
| 67 | Cloud Logging: log sinks, log-based metrics | ❌ | Need to study |
| 68 | Data pipeline SLAs and error handling strategies | ❌ | Need to study |

### Security & Governance
| # | Topic | Rating | Notes |
|---|-------|--------|-------|
| 69 | IAM: roles, service accounts, least privilege | ❌ | Need to study |
| 70 | Encryption: CMEK, CSEK, default encryption | ❌ | Need to study |
| 71 | VPC Service Controls for data services | ❌ | Need to study |
| 72 | Data Loss Prevention (DLP): inspection, de-identification | ❌ | Need to study |

### Automation & Infrastructure
| # | Topic | Rating | Notes |
|---|-------|--------|-------|
| 73 | Terraform for GCP data infrastructure | ❌ | Need to study |
| 74 | CI/CD for data pipelines (Cloud Build) | ❌ | Need to study |
| 75 | Composer/Airflow: DAG design, scheduling, sensors | ❌ | Need to study |
| 76 | Data Catalog / Dataplex: metadata, data lineage, quality | ❌ | Need to study |

---

## Summary

- Total ✅: **4** (5%)
- Total ⚠️: **0** (0%)
- Total ❌: **72** (95%)

## Analysis

Your 4 confident topics: batch vs streaming design, Composer/Airflow, BigQuery vs Bigtable vs Spanner vs Cloud SQL, Pub/Sub basics.

**Key insight**: You have strong hands-on experience but need to build **exam-level theoretical knowledge** across all 5 domains. The gap is not in your ability to do the work — it's in knowing the specific GCP service details, decision criteria, and best practices the exam tests.

## Priority Study Plan (adjusted)

Given the broad gap, the 6-week plan needs to be more intensive. Focus on high-weight domains first:

1. **Domain 2 (25%)** — Dataflow deep-dive, Dataproc, Data Fusion, ingestion patterns
2. **Domain 1 (22%)** — Windowing, watermarks, exactly-once, storage design, system design
3. **Domain 3 (20%)** — All storage services in depth (Bigtable, Spanner, Cloud SQL, GCS)
4. **Domain 5 (18%)** — Security (IAM, encryption, VPC-SC, DLP), monitoring, Terraform
5. **Domain 4 (15%)** — BigQuery ML, Vertex AI, Looker, data preparation

**Recommendation**: Consider extending the study plan to 8-10 weeks at 1-2 hours/day, OR increasing to 2-3 hours/day to keep the 6-week timeline. The cheatsheets already cover most of what you need — study them thoroughly.
