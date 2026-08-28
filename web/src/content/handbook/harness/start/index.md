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
| Multi-step orchestration or human approval | The Harness orchestration chapter |

Do not add a sandbox, MCP client, memory engine, or guardrail package until its
boundary is required. Each is enabled separately and has different security and
operational consequences.

## What success looks like

The first agent returns a value that matches your output schema. A deterministic
test can inject a fake provider, so routine tests do not need a network call or a
provider credential.

Next: [requirements and installation](/handbook/harness/start/requirements-and-installation/).
