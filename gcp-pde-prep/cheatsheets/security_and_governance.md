# Cheatsheet: Security & Governance

## IAM — Identity and Access Management

### Key Concepts

| Concept | Description |
|---------|-------------|
| Principal | Who (user, service account, group) |
| Role | What they can do (collection of permissions) |
| Resource | What they can do it on (project, dataset, table) |
| Policy | Binds principal + role + resource |

### Role Types

| Type | Example | When to use |
|------|---------|-------------|
| Basic | Owner, Editor, Viewer | Almost never (too broad) |
| Predefined | `roles/bigquery.dataViewer` | Most cases |
| Custom | Your own set of permissions | When predefined is too broad/narrow |

### Key Predefined Roles for Data

| Role | What it can do |
|------|---------------|
| `bigquery.dataViewer` | Read tables and views |
| `bigquery.dataEditor` | Read + write tables |
| `bigquery.dataOwner` | Full control on datasets |
| `bigquery.jobUser` | Run queries (but need dataViewer to see data) |
| `bigquery.user` | Run queries + create datasets |
| `bigquery.admin` | Everything |
| `dataflow.developer` | Create and manage Dataflow jobs |
| `dataflow.worker` | Used by worker VMs (service account) |
| `composer.user` | Manage Composer environments |
| `storage.objectViewer` | Read GCS objects |

### Service Accounts Best Practices
- Use dedicated service accounts per service/pipeline (not default)
- Grant minimum required roles
- Use Workload Identity Federation for cross-cloud (avoid key files)
- Rotate keys if using JSON key files (prefer Workload Identity instead)

**Exam shortcut**: "Authenticate pipeline to BigQuery" → service account with `bigquery.dataEditor` + `bigquery.jobUser`.

---

## Encryption

### Three Levels

| Level | Who manages keys | Key storage | Use case |
|-------|-----------------|-------------|----------|
| **Default (GMEK)** | Google | Google-managed | Most cases (always on) |
| **CMEK** | Customer | Cloud KMS | Compliance, key control |
| **CSEK** | Customer | Customer's infrastructure | Maximum control, Google never has key |

### Key Exam Points
- All GCP data is encrypted at rest by default (no action needed)
- CMEK: you create key in Cloud KMS, assign to BigQuery/GCS/Bigtable
- CSEK: you provide key in API calls, Google uses it temporarily, doesn't store it
- CMEK supports automatic key rotation
- CSEK does NOT support automatic rotation (manual)
- Envelope encryption: data encrypted with DEK, DEK encrypted with KEK

**Exam shortcut**: "Company policy requires managing their own keys" → CMEK. "Google must never have access to keys" → CSEK.

---

## VPC Service Controls

### What It Does
Creates a security perimeter around GCP services to prevent data exfiltration.

### How It Works
```
[Service Perimeter]
  ├── Project A (BigQuery)
  ├── Project B (GCS)  
  └── Project C (Dataflow)
  
  Data can flow between A, B, C
  Data CANNOT leave the perimeter
```

### Key Concepts

| Concept | Description |
|---------|-------------|
| Service perimeter | Boundary around projects/services |
| Access levels | Who can cross the perimeter (IP, identity) |
| Ingress rules | What can come IN |
| Egress rules | What can go OUT |
| Bridge | Connect two perimeters |

### Exam Scenarios
- "Prevent BigQuery data from being copied to external project" → VPC Service Controls
- "Allow specific partner to access data" → Access level + ingress rule
- "Two teams need to share data but both have perimeters" → Bridge

---

## Data Loss Prevention (DLP)

### Core Operations

| Operation | What it does | Example |
|-----------|-------------|---------|
| Inspection | Find sensitive data | Scan BigQuery table for SSNs |
| De-identification | Remove/mask sensitive data | Replace emails with `[REDACTED]` |
| Re-identification | Reverse de-identification | Restore original data (with key) |

### De-identification Techniques

| Technique | Reversible? | Description |
|-----------|-------------|-------------|
| Masking | No | Replace characters (`****1234`) |
| Redaction | No | Remove entirely |
| Bucketing | No | Replace with range (`20-30`) |
| Date shifting | No* | Shift dates by random amount |
| Tokenization | Yes | Replace with surrogate token |
| Crypto hash | No | One-way hash |
| Format-preserving encryption | Yes | Encrypt but keep format (e.g., 16-digit → 16-digit) |
| Deterministic encryption | Yes | Same input → same output (for joins) |

*Date shifting can be reversible if context (key) is preserved.

### InfoTypes (Built-in Detectors)
- `PERSON_NAME`, `EMAIL_ADDRESS`, `PHONE_NUMBER`
- `CREDIT_CARD_NUMBER`, `US_SOCIAL_SECURITY_NUMBER`
- `IP_ADDRESS`, `DATE_OF_BIRTH`
- Custom InfoTypes: regex or dictionary-based

**Exam shortcut**: "Anonymize PII for analytics" → DLP de-identification. "Find credit cards in GCS files" → DLP inspection.

---

## Data Governance

### Data Catalog

| Feature | Description |
|---------|-------------|
| Auto-discovery | Automatically indexes BigQuery, Pub/Sub, GCS |
| Search | Find datasets by name, tag, description |
| Tag templates | Custom metadata (e.g., data owner, PII level) |
| Policy tags | Column-level access control in BigQuery |

### Dataplex

| Feature | Description |
|---------|-------------|
| Data lakes | Organize data across GCS + BigQuery |
| Zones | Raw zone → curated zone |
| Data quality | Define and enforce quality rules |
| Data lineage | Track data origin and transformations |
| Auto-discovery | Scan and classify data assets |

### Column-Level Security (BigQuery)
1. Create policy tag taxonomy in Data Catalog
2. Assign policy tags to BigQuery columns
3. Grant `Fine-Grained Reader` role to authorized users
4. Unauthorized users see `ACCESS DENIED` for those columns

**Exam shortcut**: "Restrict access to salary column" → policy tags + Data Catalog.

---

## Compliance Quick Reference

| Requirement | GCP Solution |
|-------------|-------------|
| Encrypt all data at rest | Default (automatic) |
| Customer-managed encryption keys | CMEK (Cloud KMS) |
| Prevent data exfiltration | VPC Service Controls |
| Find and mask PII | DLP |
| Column-level access control | Policy tags (Data Catalog) |
| Audit data access | Cloud Audit Logs |
| Data residency (keep in region) | Regional datasets/buckets |
| Right to erasure (GDPR) | DML DELETE in BigQuery, lifecycle in GCS |
| Track data origin | Data lineage (Dataplex) |
| Classify data assets | Data Catalog tags |

---

## Cloud Audit Logs

| Log Type | What it records | Always on? |
|----------|----------------|------------|
| Admin Activity | Config changes (create/delete/update) | Yes (free) |
| Data Access | Read/write to data | No (must enable, costs $) |
| System Event | Google-initiated actions | Yes (free) |
| Policy Denied | Access denied events | Yes (free) |

**Exam shortcut**: "Who accessed this BigQuery table?" → Enable Data Access audit logs.
