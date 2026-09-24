# Cheatsheet: Dataflow & Apache Beam Patterns

## Core Beam Concepts (Exam Must-Know)

### Pipeline Structure
```
Pipeline → PCollection → Transform → PCollection → Transform → ...
```

### Key Transforms

| Transform | What it does | Exam context |
|-----------|-------------|--------------|
| `ParDo` | Element-wise processing (map) | Most common, custom logic |
| `GroupByKey` | Groups elements by key | Aggregation, but causes shuffle |
| `CoGroupByKey` | Joins two PCollections by key | "Join two data sources" |
| `Combine` | Aggregation (sum, avg, etc.) | More efficient than GroupByKey for aggregation |
| `Flatten` | Merges multiple PCollections | "Union of datasets" |
| `Partition` | Splits PCollection into multiple | "Route data to different sinks" |
| `Filter` | Keep elements matching condition | Data quality / cleaning |

### Side Inputs & Side Outputs

| Concept | What it does | Exam context |
|---------|-------------|--------------|
| Side input | Small dataset used for lookups in ParDo | "Enrich stream with static data" |
| Side output (tagged output) | Multiple outputs from one transform | "Route errors to dead-letter queue" |

---

## Windowing (Critical for Exam)

### Window Types

| Window | How it works | Use case |
|--------|-------------|----------|
| **Fixed** | Non-overlapping, fixed duration (e.g., every 5 min) | Regular aggregation intervals |
| **Sliding** | Overlapping, fixed duration + period | Moving averages, trends |
| **Session** | Gap-based, groups by activity | User sessions, clickstreams |
| **Global** | Single window for all data | Batch processing (default) |

### Triggers
Control WHEN results are emitted within a window.

| Trigger | When it fires | Use case |
|---------|--------------|----------|
| Default (event time) | When watermark passes window end | Standard processing |
| Processing time | Based on wall clock | Periodic early results |
| Data-driven | After N elements | Counting-based logic |
| Composite | Combination of above | Early results + final result |

### Watermarks & Late Data
- **Watermark**: estimate of how far behind real-time the pipeline is
- **Allowed lateness**: how long to keep window state for late elements
- **Accumulation modes**:
  - `DISCARDING`: each pane contains only new data
  - `ACCUMULATING`: each pane contains all data so far

**Exam shortcut**: "Handle late-arriving data" → allowed lateness + accumulation mode.

---

## Dataflow-Specific Features

### Templates

| Type | Characteristics | When to use |
|------|----------------|-------------|
| Classic Templates | Pre-compiled, limited runtime params | Simple, reusable jobs |
| Flex Templates | Docker container, full flexibility | Complex jobs, custom dependencies |

**Exam shortcut**: "Ops team runs pipelines with different parameters" → Flex Templates.

### Execution Modes

| Feature | What it does | When to enable |
|---------|-------------|----------------|
| Shuffle Service | Offloads shuffle to managed service | Large GroupByKey operations |
| Streaming Engine | Separates compute from state | Streaming pipelines (default now) |
| FlexRS | Flexible scheduling for batch | Cost savings on batch (not time-sensitive) |
| Dataflow Prime | Advanced autoscaling, right-fitting | Large-scale production |

### Streaming Semantics

| Mode | Guarantee | Latency | Use case |
|------|-----------|---------|----------|
| Exactly-once (default) | No duplicates, no data loss | Higher | Financial, critical data |
| At-least-once | Possible duplicates, no data loss | Lower | Logs, metrics, non-critical |

### Pipeline Updates

| Method | When to use | Constraint |
|--------|-------------|------------|
| In-place update | Compatible changes (add steps, modify logic) | Same pipeline structure |
| Drain | Stop processing new data, flush existing | When in-place not possible |
| Cancel | Immediate stop | Emergency only, may lose data |

**Exam shortcut**: "Update streaming pipeline without data loss" → in-place update. "Graceful shutdown" → drain.

---

## Common Exam Scenarios

### Scenario 1: "Join streaming data with a lookup table"
**Answer**: Side input — load the lookup table as a side input in a ParDo

### Scenario 2: "Route bad records to a separate output"
**Answer**: Side output (tagged output) — send errors to a dead-letter PCollection

### Scenario 3: "Aggregate user clicks in 10-minute windows"
**Answer**: Fixed windows of 10 minutes + GroupByKey or Combine

### Scenario 4: "Calculate moving average over last hour, update every 5 minutes"
**Answer**: Sliding window (duration=60min, period=5min)

### Scenario 5: "Group user activity by session with 30-min timeout"
**Answer**: Session windows with 30-minute gap duration

### Scenario 6: "Process data but allow 2 hours for late arrivals"
**Answer**: `.withAllowedLateness(Duration.standardHours(2))`

### Scenario 7: "Deploy pipeline for non-technical team to run"
**Answer**: Flex Template with runtime parameters

### Scenario 8: "Reduce cost of daily batch pipeline that's not time-sensitive"
**Answer**: Enable FlexRS (Flexible Resource Scheduling)

### Scenario 9: "Stream from Pub/Sub, process, write to BigQuery"
**Answer**: PubsubIO.read → transforms → BigQueryIO.write (classic streaming pattern)

### Scenario 10: "Existing Spark streaming job, move to GCP"
**Answer**: Dataproc (NOT Dataflow) — keep existing Spark code
