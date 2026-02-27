---
title: AI Agents
description: Overview of the @purista/ai package and how agents extend a PURISTA application.
order: 203700
---

# AI Agents in PURISTA

`@purista/ai` brings multi-agent orchestration into an existing PURISTA application without changing the core runtime. Agents use the same builder/config patterns as services, run beside your domain services, and plug into EventBridge tracing, schemas, metrics, and managed config.

This overview explains when agents make sense, how they fit into the project layout, and where to go next in the handbook.

## When to reach for agents

Use agents when you need one or more LLM-powered workers that must:

- share infrastructure with the rest of your PURISTA services (EventBridge, tracing, config, logging)
- stream intermediate results (token-by-token, tool telemetry, custom artifacts)
- coordinate async & background work pools with strict concurrency limits
- reuse existing commands as tools with the familiar `.canInvoke`-style allowlist
- publish manifests/config just like services so CI/CD can promote revisions predictably

## Project layout & scaffolding

Generate your first agent with the CLI:

```bash
purista add agent supportAgent
```

The CLI mirrors the service generators: it creates the folder structure, builder file, schemas, and a Vitest spec under `src/agents/<agentName>/v<version>/`.

```
src/
 ├─ services/
 └─ agents/
     └─ supportAgent/
         └─ v1/
             ├─ supportAgent.ts
             └─ supportAgent.test.ts
```

Agents are first-class citizens in the repository: they have their own folder hierarchy, can be exposed via HTTP endpoints, scheduled through queues, or invoked ad hoc from commands and tests.

## Where to go next

Each of the following handbook chapters dives into a focused aspect of the AI stack. Read them in order for a complete understanding or jump straight to the topic you need:

1. [The Agent Builder](./agent-builder.md) — define metadata, schemas, resources, tools, concurrency pools, and HTTP exposure.
2. [Run & Invoke Agents](./running-and-invoking-agents.md) — start instances, wire dependencies, and call agents from commands, queues, or HTTP bridges.
3. [Model Providers & OpenAI](./model-providers-and-openai.md) — register Vercel AI SDK providers (OpenAI, Anthropic, …) and reuse them across agents.
4. [State, History & Knowledge](./state-history-and-knowledge.md) — persist conversations, plug in custom session/knowledge adapters, and share context between agents.
5. [Protocol & Streaming](./protocol-and-streaming.md) — understand the agent protocol frames, emit telemetry, and transform streams for AI SDK UI clients.
6. [Testing & Evaluation](./testing-and-evaluation.md) — scaffold Vitest specs, capture JSON eval outputs, and compare models/prompts safely.

If you are brand new to PURISTA, skim the [services](../service/index.md) chapter first—agents intentionally reuse the same vocabulary (builders, stores, managed config) so you never learn two mental models.
