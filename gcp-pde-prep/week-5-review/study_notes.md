# Week 5 — Review + Second Practice Exam

**Goal**: Validate progress and close remaining gaps.
**Time**: ~7 hours (1-2h/day)

---

## Day 1-2: Review All Cheatsheets (2 hours)

- [ ] Review `cheatsheets/services_comparison.md`
- [ ] Review `cheatsheets/dataflow_patterns.md`
- [ ] Review `cheatsheets/security_and_governance.md`
- [ ] Review your notes from weeks 2-4

Focus on the topics you marked as ⚠️ or ❌ in the initial assessment.

---

## Day 3: Second Practice Exam (2 hours)

Use a DIFFERENT source than week 1.

- **Date taken**: ___
- **Source**: ___
- **Score**: ___ / ___ ( __% )
- **Time spent**: ___ minutes

### Score Comparison

| | Week 1 | Week 5 | Delta |
|---|--------|--------|-------|
| **Overall** | __% | __% | __% |
| Domain 1 (Design) | | | |
| Domain 2 (Ingest/Process) | | | |
| Domain 3 (Storage) | | | |
| Domain 4 (Analysis/ML) | | | |
| Domain 5 (Maintain/Automate) | | | |

---

## Day 3-4: Gap Closing (2 hours)

Record topics still below 80% accuracy:

| Topic | Week 1 result | Week 5 result | Action |
|-------|--------------|---------------|--------|
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |

For each topic above, spend 20-30 minutes re-reading the relevant docs and cheatsheet section.

---

## Day 5: Exam Strategy (1 hour)

### Question patterns to recognize

1. **"Most cost-effective"** → look for: partitioning, flat-rate, preemptible, lifecycle policies
2. **"Minimum operational overhead"** → look for: serverless options (Dataflow, BigQuery, Serverless Dataproc)
3. **"Migrate existing Spark jobs"** → Dataproc (not Dataflow)
4. **"Real-time / streaming"** → Pub/Sub + Dataflow
5. **"Global transactions"** → Spanner
6. **"Low-latency, high-throughput NoSQL"** → Bigtable
7. **"Non-technical users build pipelines"** → Data Fusion
8. **"SQL team needs ML"** → BigQuery ML
9. **"Prevent data exfiltration"** → VPC Service Controls
10. **"Detect/remove PII"** → DLP

### Time management
- 2 hours for ~50-60 questions = ~2 minutes per question
- Flag difficult questions and come back
- Never leave a question unanswered (no penalty for guessing)
- Read ALL options before selecting — the exam tests if you pick the BEST answer

### Elimination technique
- Read the question stem carefully: "most cost-effective" vs "fastest" vs "most secure"
- Eliminate obviously wrong answers first
- Between two plausible answers, pick the one that uses managed/serverless services

---

## Ready to book the exam?

- [ ] Week 5 practice exam score is 80%+
- [ ] No domain is below 70%
- [ ] Comfortable with time management (finishing in under 2 hours)
- [ ] Reviewed all cheatsheets

If all checked → book the exam for next week. If not → spend 2-3 more days on weak areas.
