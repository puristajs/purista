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
purista add agent supportAgent
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

## Where to go next

Recommended order for new users:

1. [The Agent Builder](./agent-builder.md) — purpose, main methods, and first runnable agent.
2. [Run & Invoke Agents](./running-and-invoking-agents.md) — bootstrap in `src/index.ts`, call from commands/subscriptions, expose HTTP.
3. [Model Providers & OpenAI](./model-providers-and-openai.md) — wire provider instances at runtime.
4. [State, History & Knowledge](./state-history-and-knowledge.md) — tenant/user-aware memory and shared knowledge.
5. [Protocol & Streaming](./protocol-and-streaming.md) — practical streaming and protocol helpers.
6. [Testing Agents](./testing.md) — deterministic unit/integration tests.
7. [Agent Evaluation](./evaluation.md) — dataset-driven evaluation output and CI comparison.

For protocol internals and semantics, continue with [Advanced → AI Protocol](../advanced/ai-protocol.md).

If you are brand new to PURISTA, start with [Service](../service/index.md) and [Command](../command/index.md) first. The agent APIs intentionally reuse the same language.
