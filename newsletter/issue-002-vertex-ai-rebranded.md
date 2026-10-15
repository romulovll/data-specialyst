# Cloud Decoded #002 — Vertex AI Is Dead. Meet Gemini Enterprise Agent Platform.

> **TL;DR:** Google killed the Vertex AI name and replaced it with "Gemini Enterprise Agent Platform." It's not just a rename — it's a shift from "build ML models" to "build AI agents." If you're studying for GCP certs, the exam guide changed.

---

## What Google Announced (Next '26, April 2026)

At Google Cloud Next '26 in Las Vegas, Google announced that Vertex AI has been rebranded and expanded into the **Gemini Enterprise Agent Platform**. This brings together model selection, model building, and agent building with new features for agent orchestration, security, and DevOps.

**The official words:**
> "Gemini Enterprise Agent Platform brings the model selection, model building, and tuning services of Vertex AI, along with new features for agent integration, security, DevOps, orchestration, and more."

---

## In Plain Language

Think of it this way:

**Vertex AI was:** "Here's a platform to train and deploy ML models."

**Gemini Enterprise Agent Platform is:** "Here's a platform to build AI agents that can think, act, call APIs, talk to each other, and make decisions — using any model you want."

The focus shifted from **models** to **agents**. A model predicts. An agent acts.

---

## What Actually Changed (Not Just the Name)

| Before (Vertex AI) | After (Agent Platform) |
|---|---|
| Train models | Build agents that use models |
| Deploy endpoints | Agent Runtime with sub-second cold starts |
| Model Garden (150+ models) | Model Garden (200+ models including Claude, Llama) |
| Pipelines (Kubeflow) | Agent-to-agent orchestration |
| — | Agent Identity (cryptographic IDs) |
| — | Agent Gateway (centralized policy enforcement) |
| — | Agent Observability (OpenTelemetry) |
| — | Agent Studio (low-code, natural language) |

---

## Real Example: Before vs After

### Before — Deploy an ML model for customer churn prediction

```python
# Old Vertex AI way: train, deploy, predict
from google.cloud import aiplatform

aiplatform.init(project="my-project", location="us-central1")

# Train
job = aiplatform.AutoMLTabularTrainingJob(display_name="churn-model")
model = job.run(dataset=dataset, target_column="churned")

# Deploy to endpoint
endpoint = model.deploy(machine_type="n1-standard-4")

# Predict
prediction = endpoint.predict(instances=[{"age": 32, "plan": "premium"}])
```

### After — Build an agent that detects AND acts on churn

```python
# New Agent Platform way: agent that thinks + acts
from google.cloud import agentplatform

agent = agentplatform.Agent(
    display_name="churn-prevention-agent",
    model="gemini-3.1-pro",
    tools=[
        agentplatform.Tool(name="query_bigquery", description="Query customer data"),
        agentplatform.Tool(name="send_email", description="Send retention email"),
        agentplatform.Tool(name="create_discount", description="Generate discount code"),
    ],
    instructions="""
    You are a customer retention agent.
    1. Query BigQuery for customers with high churn risk
    2. For each at-risk customer, decide the best retention action
    3. Execute the action (email, discount, or escalate to human)
    """
)

agent.deploy()
```

**The difference:** The old way predicts churn. The new way predicts churn AND takes action to prevent it. That's the leap from ML to agents.

---

## Why This Matters For You

### If you're a Data Architect:
Your architecture diagrams just got a new layer. Between "data platform" and "business applications," there's now an **agent layer**. You need to design: where agents live, how they authenticate, what data they access, and how they're governed.

### If you're studying for GCP certification:
The **GCP Professional Cloud Architect** exam was updated to include agentic AI case studies. The **Professional ML Engineer** exam now covers agent orchestration. If you see "Vertex AI" in old study materials, mentally replace it with "Gemini Enterprise Agent Platform."

### If you're a Data Engineer:
Agents will call your pipelines. Your Dataflow jobs, BigQuery queries, and Pub/Sub topics become **tools** that agents invoke. Your data infrastructure becomes the foundation that agents reason over.

---

## Try It Yourself (5 minutes)

You don't need to build an agent from scratch. Try the Agent Studio:

1. Go to console.cloud.google.com → Gemini Enterprise Agent Platform
2. Click "Agent Studio" 
3. Describe your agent in natural language: "An agent that queries my BigQuery sales table and summarizes weekly trends"
4. The platform generates the agent code for you

---

## One-Liner Takeaway

> Vertex AI trained models. Gemini Enterprise Agent Platform builds agents that think, decide, and act — using any model. The AI era just became the **agentic era**.

---

*Cloud Decoded — Google Cloud announcements, decoded for practitioners. By [Romulo Leao](https://romulovll.github.io/data-specialyst/).*
