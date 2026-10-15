# Cloud Decoded #005 — Cloud Run Now Runs AI Agents (with Identity, Sandboxes, and GPUs)

> **TL;DR:** Cloud Run got three superpowers in 2026: Agent Identity (your AI agent gets its own cryptographic ID), sandboxes (300 ephemeral environments per second), and GPU support (NVIDIA RTX PRO 6000). Serverless just became the default home for AI agents.

---

## What Changed

Cloud Run was a serverless container platform. Now it's becoming the **default runtime for AI agents** on GCP. Three key additions:

1. **Agent Identity** — Each agent gets a unique, cryptographic ID for authentication
2. **Sandboxes** — Spin up 300 isolated environments per second for agent code execution
3. **GPU support** — NVIDIA RTX PRO 6000 Blackwell GPUs for ML inference

---

## In Plain Language

**Before:** Cloud Run runs web APIs and microservices. Scales to zero. Pay per request. Nice.

**After:** Cloud Run runs AI agents that have their own identity, can spin up secure sandboxes to execute code, and have GPUs for running ML models locally — all serverless.

---

## Feature 1: Agent Identity

The problem: When an AI agent calls your BigQuery API, who is it? A human? A service account? A rogue agent?

The solution: **Agent Identity** gives each agent a unique cryptographic ID, registered in the Agent Registry.

```yaml
# Deploy a Cloud Run service with Agent Identity
gcloud run deploy my-data-agent \
  --image gcr.io/my-project/data-agent \
  --agent-identity=enabled \
  --agent-registry=enabled

# Now this agent has:
# - A unique cryptographic ID
# - Registered in the Agent Registry
# - Can be tracked, audited, and governed
# - Other services can verify "is this really my-data-agent?"
```

**Why it matters for architects:** You can now design agent-to-agent communication with **zero-trust principles**. Agent A calls Agent B → Agent B verifies Agent A's identity before responding. Same as microservices mTLS, but for AI agents.

---

## Feature 2: Sandboxes (300/second)

The problem: An AI agent generates Python code and wants to execute it. You can't just `exec()` random code in production — it's a security nightmare.

The solution: **Agent Sandboxes** — ephemeral, strictly isolated containers that spin up in milliseconds.

```
Agent: "I need to run this pandas script to analyze the data"
     ↓
Cloud Run Sandbox spins up (milliseconds)
     ↓
Code executes in complete isolation
     ↓
Results returned to agent
     ↓
Sandbox destroyed
```

300 sandboxes per second per cluster. Each one is fully isolated — a compromised sandbox can't affect your production environment.

**Real use case:** Your Data Science Agent in BigQuery generates a visualization script. Instead of running it in an unsafe environment, it spins up a sandbox, executes the script, returns the chart, and destroys the sandbox. All in under a second.

---

## Feature 3: GPU Support

```yaml
# Deploy an ML inference service with GPU
gcloud run deploy my-inference-api \
  --image gcr.io/my-project/ml-model \
  --gpu=nvidia-rtx-pro-6000 \
  --gpu-count=1 \
  --min-instances=0 \
  --max-instances=5
```

**Before:** Need GPU inference? Set up a GKE cluster, configure node pools with GPUs, manage scaling, handle driver updates.

**After:** `--gpu=nvidia-rtx-pro-6000`. Done. Scales to zero when not in use.

---

## Also New: Ambient Networking

Cloud Run got **ambient networking** — a new data plane that provides:
- Service discovery between Cloud Run services and GKE pods
- Zero-trust access (mTLS by default)
- Traffic management
- No sidecar proxies needed

**In plain language:** Your Cloud Run services and GKE pods can find and securely talk to each other automatically. No more configuring service mesh, Istio, or Envoy.

---

## Architecture Impact

### Before (2025)

```
User → Load Balancer → GKE (agents) → Vertex AI (models)
                                     → BigQuery (data)
                                     → Cloud SQL (state)

Complex. GKE cluster management. GPU node pools. Service mesh.
```

### After (2026)

```
User → Load Balancer → Cloud Run (agents + GPU + sandboxes)
                                     → BigQuery (data)
                                     → Cloud SQL (state)

Simpler. Serverless. Scales to zero. Agent Identity built-in.
```

---

## Why This Matters For You

### If you're a Data Architect:
The "where do agents run?" question now has a clear answer: **Cloud Run**. With Agent Identity, sandboxes, and GPUs, there's less reason to spin up GKE clusters for agent workloads. Simpler architecture.

### If you're studying for GCP certification:
The compute decision matrix updated:
- **Cloud Run** → Serverless containers, agents, GPU inference, sandboxes
- **GKE** → Complex orchestration, multi-container pods, stateful workloads
- **Compute Engine** → Full VM control, custom OS, legacy apps

### If you're a Data Engineer:
Your Dataflow pipelines might get called by agents via Cloud Run. Design your APIs to be agent-friendly: clear inputs, structured outputs, good error messages.

---

## One-Liner Takeaway

> Cloud Run went from "serverless web API" to "serverless AI agent runtime with its own identity, sandboxes, and GPUs." GKE just lost half its use cases.

---

*Cloud Decoded — Google Cloud announcements, decoded for practitioners. By [Romulo Leao](https://romulovll.github.io/data-specialyst/).*
