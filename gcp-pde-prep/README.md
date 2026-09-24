# GCP Professional Data Engineer — Exam Prep

## Exam Info

- **Exam**: Google Cloud Professional Data Engineer
- **Duration**: 2 hours
- **Questions**: 50-60 multiple choice / multiple select
- **Passing score**: ~70% (Google doesn't publish exact threshold)
- **Cost**: $200 USD
- **Validity**: 2 years
- **Registration**: cloud.google.com/certification

## Study Timeline — 6 Weeks (1-2 hrs/day)

| Week | Focus | Hours | Status |
|------|-------|-------|--------|
| 1 | Diagnostic: self-assessment + practice exam | 7h | ⬜ |
| 2 | Storage & Databases gaps | 7h | ⬜ |
| 3 | Processing & ML gaps | 7h | ⬜ |
| 4 | Design & Security gaps | 7h | ⬜ |
| 5 | Review + second practice exam | 7h | ⬜ |
| 6 | Final review + take the exam | 5h | ⬜ |

## Strategy

**Diagnostic-first**: Take a practice exam first, identify gaps, study only what you don't know. With 7+ years of GCP experience, you likely know 70%+ already.

## Exam Domains

| # | Domain | Weight |
|---|--------|--------|
| 1 | Designing data processing systems | 22% |
| 2 | Ingesting and processing data | 25% |
| 3 | Storing data | 20% |
| 4 | Preparing and using data for analysis | 15% |
| 5 | Maintaining and automating data workloads | 18% |

## Resources

- **Official exam guide**: Google Cloud certification page
- **Free practice exam**: Google's official sample questions
- **Practice tests**: Whizlabs, ExamTopics
- **Labs**: Google Cloud Skills Boost (free tier available)
- **Docs**: cloud.google.com/docs (the ultimate source of truth)

## Project Structure

```
gcp-pde-prep/
├── README.md                      ← you are here
├── diagnostic/
│   └── initial_assessment.md      ← START HERE: rate yourself on 72 topics
├── week-1-diagnostic/
│   └── gap_analysis.md            ← record practice exam results
├── week-2-storage/
│   └── study_notes.md             ← Bigtable, Spanner, Dataproc, Data Catalog
├── week-3-processing/
│   └── study_notes.md             ← BigQuery ML, Vertex AI, DLP, Data Fusion
├── week-4-design/
│   └── study_notes.md             ← Migration, cost optimization, security
├── week-5-review/
│   └── study_notes.md             ← Second practice exam + gap closing
├── week-6-final/
│   └── exam_day.md                ← Final review + exam day strategy
└── cheatsheets/
    ├── services_comparison.md     ← When to use which GCP service
    ├── dataflow_patterns.md       ← Beam/Dataflow exam patterns
    └── security_and_governance.md ← IAM, encryption, DLP, compliance
```
