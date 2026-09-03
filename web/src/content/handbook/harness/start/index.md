---
title: Start with AI Harness
description: Build one typed agent, prove it works, then add only the capabilities your application needs.
order: 10
---

AI Harness is an in-process TypeScript runtime for model-backed work. Your
application owns transport, authentication, authorization, secrets, and business
side effects. Harness owns typed agent runs, sessions, model-provider boundaries,
and run events.

Start with one model alias, one agent, and one direct invocation. That reaches a
working result without committing to tools, workflows, durable storage, or a
specific deployment shape.

```text title="First successful run"
Install core + one provider → define a typed agent → open a session → invoke it
```

## Choose the first path

| Need | Start here |
| --- | --- |
| A typed answer, extraction, summary, or classification | [Build the first agent](/handbook/harness/start/build-the-first-agent/) |
| One model provider and safe configuration | [Configure the first model](/handbook/harness/start/configure-the-first-model/) |
| One safe application capability | [Add the first tool](/handbook/harness/start/add-the-first-tool/) |
| Sessions, streams, timeouts, or structured output | [Build agents](/handbook/harness/build-agents/) |
| Multi-step orchestration or human approval | [Orchestrate work](/handbook/harness/orchestrate-work/) |

Do not add a sandbox, MCP client, memory engine, or guardrail package until its
boundary is required. Each is enabled separately and has different security and
operational consequences.

## Grow through three useful outcomes

You do not need to configure every Harness boundary before the first run. Add
the next layer only when the application needs its guarantee:

| Outcome | Smallest useful setup | Replace or add before production |
| --- | --- | --- |
| Typed agent | Core, one model provider, one agent, and the default in-memory storage and memory | Application authentication, stable session identity, secret management, provider budgets, and an explicit retention policy |
| Safe tool-using agent | Add one typed application tool with handler authorization; add named built-ins only when required | Explicit tool permissions, idempotent side effects, and a sandbox whose process, filesystem, network, and tenant isolation match the workload |
| Durable reviewed workflow | Add durable steps and external waits; use `localDurableExecution()` only for a trusted single-host proof | A distributed `HarnessStorage`, compatible durable workspace, worker/resume queue, application review store, reviewer authorization, and a production sandbox when execution needs isolation |

The third row is an integration architecture, not a bundled hosted service.
Harness supplies the contracts and recovery semantics; the application supplies
the distributed adapters, reviewer experience, identity, queue, and deployment.
See [packages and feature availability](/handbook/harness/reference/packages-and-feature-availability/)
before selecting production infrastructure.

## What success looks like

The first agent returns a value that matches your output schema. A deterministic
test can inject a fake provider, so routine tests do not need a network call or a
provider credential.

Next: [requirements and installation](/handbook/harness/start/requirements-and-installation/).
