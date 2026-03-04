---
title: AI Agents
description: Overview of the @purista/ai package and how agents extend a PURISTA application.
order: 203700
---

# AI Agents in PURISTA

`@purista/ai` adds agent workloads to a PURISTA application without changing PURISTA core primitives. Agents use the same builder pattern as services, run on the same EventBridge, and follow the same validation, logging, and tracing conventions.

This chapter is written as a learning path: start simple, then move to protocol/operations topics.

## When to reach for agents

Use agents when you need one or more LLM-powered workloads that must:

- share infrastructure with existing services (EventBridge, tracing, config, logging)
- stream progressive results to clients (chunks, artifacts, tool frames, telemetry)
- control parallelism through runtime worker pool settings
- reuse existing commands as tools with explicit allowlists
- keep deployment/runtime configuration outside of business logic

## Project layout & scaffolding

Use the CLI first. It creates a runnable skeleton and test:

```bash
purista add agent SupportAgent
```

The generator creates:

- `src/agents/<agentName>/v<version>/<agentName>.ts` (builder + handler skeleton)
- `src/agents/<agentName>/v<version>/<agentName>.test.ts` (deterministic test scaffold)

```
src/
 ├─ services/
 └─ agents/
     └─ supportAgent/
         └─ v1/
             ├─ supportAgent.ts
             └─ supportAgent.test.ts
```

From there, you can expose the agent over HTTP, invoke it from commands/subscriptions, or run it in background workers.

## What you will configure (and why)

| Area | Typical choice | Why it matters |
| --- | --- | --- |
| models | `defineModel(...)` + runtime provider injection | quality, latency, and provider flexibility |
| conversation persistence | `persistConversation('user' | 'agent')` | memory quality vs token efficiency |
| tools | explicit `allowTool(...)` list | security and predictable behavior |
| pool/concurrency | runtime `poolConfig.maxWorkers` | throughput, rate-limit protection, cost control |
| transport | HTTP SSE, command invoke, queue worker | caller UX and operational profile |

## Where to go next

Recommended order for new users:

1. [The Agent Builder](./agent-builder.md) — purpose, main methods, and first runnable agent.
2. [Run & Invoke Agents](./running-and-invoking-agents.md) — bootstrap in `src/index.ts`, call from commands/subscriptions, expose HTTP.
3. [Model Providers & OpenAI](./model-providers-and-openai.md) — wire provider instances at runtime.
4. [Conversation Persistence](./conversation-persistence.md) — memory strategies, summary behavior, and retry-safe staging.
5. [Knowledge Adapters](./knowledge-adapters.md) — RAG/data-source integration and adapter options.
6. [AI Protocol](./ai-protocol.md) — envelope model, frame semantics, and interoperability references.
7. [Protocol & Streaming](./protocol-and-streaming.md) — practical HTTP/SSE streaming and helper usage.
8. [Testing Agents](./testing.md) — deterministic unit/integration tests.
9. [Agent Evaluation](./evaluation.md) — dataset-driven evaluation output and CI comparison.

Advanced section still contains a protocol interoperability deep-dive entry point for operations teams.

If you are brand new to PURISTA, start with [Service](../service/index.md) and [Command](../command/index.md) first. The agent APIs intentionally reuse the same language.
