---
title: AI-powered service architecture and lifecycle
description: Decide whether an attached agent fits the business boundary, then understand the generated Framework primitives and the separate Harness runtime before configuring either.
order: 391
---

Choose an attached agent when the model-assisted outcome is still owned by one
versioned service: for example, classifying a support ticket, preparing a
constrained incident summary, or proposing a next business action. Keep the
decision to act in normal commands, resources, and authorization checks—not in
a prompt alone.

## What the Framework owns

`ServiceBuilder.getAgentQueueBuilder(name, description)` creates an
`AgentQueueBuilder` scoped to the service. A completed builder expands into
four normal definitions when you call `getDefinition()`:

| Generated definition | What it does | Use it when |
| --- | --- | --- |
| Command named `agentName` | Starts an aggregate run, or accepts queue work when a response mode is configured. | A caller needs a typed request/response or acceptance result. |
| Stream named `agentNameStream` | Runs the attached runtime and writes mapped run events as chunks. | A connected caller needs progressive output. |
| Queue named `agent:{service}:{version}:{agent}` | Carries work for the generated worker. | Work should be accepted and completed later. |
| Worker named `{agent}:worker` | Executes queued agent work. | The queue bridge delivers a job. |

`ServiceBuilder.addAgentDefinition(...)` adds all four to the service.
Registering only a command definition does not create the generated stream,
queue, or worker.

## What the Harness owns

The runtime created at `service.getInstance(..., { ai })` translates the
Framework attachment into a Harness session and optionally a Harness agent or
workflow. It owns provider execution, provider capability checks, tool/skill
runtime behavior, model run events, storage, workspaces, guardrails, and
evaluation. Those are configured in the [AI Harness handbook](/handbook/harness/start/);
the Framework page owns the service contract and its projection.

## Attached definition versus a standalone Harness

`setHarnessAgent({ ... })` receives the raw Harness agent-definition shape.
Harness `.agents(...)` accepts the same shape; its `agent({ ... })` helper
returns that definition unchanged. The Framework runtime creates the Harness
instance during service composition and registers the definition under the
attached agent name.

```mermaid title="Attached-agent runtime ownership"
flowchart LR
  A[Service-owned AgentQueueBuilder] --> B[Generated command, stream, queue, and worker]
  A --> C[Inline Harness agent definition]
  D[service.getInstance(eventBridge, { ai })] --> E[Core runtime adapter]
  C --> E
  E --> F[Internal defineHarness → models, storage, sandbox, skills]
  F --> G[Register definition under the attached agent name]
  G --> H[Build Harness session runtime]
  B --> H
```

| Runtime form | Owner | Boundary |
| --- | --- | --- |
| `defineHarness(...).models(...).agents(({ agent }) => ({ summarize: agent({ ... }) })).build()` | A standalone Harness runtime, including its agent names, sessions, and invocation boundary. | The resulting Harness is invoked through its own session API. It is not the value accepted by `setHarnessAgent`. |
| `serviceBuilder.getAgentQueueBuilder(...).setHarnessAgent({ ... })` | A PURISTA service contract and its command, stream, queue, and worker projections. Core builds the Harness with the `ai` binding at `getInstance`. | A second Harness created inside a service handler has a separate session/runtime and is outside the generated projections, service identity, deterministic tests, and lifecycle. |

The [Harness agent-definition guide](/handbook/harness/build-agents/agent-definition/)
describes the object fields. Attached agents are the Framework form for a
versioned service capability; standalone Harness agents retain their own
session and invocation boundary.

## Delivery branches to design deliberately

| Situation | Result | Important limit |
| --- | --- | --- |
| No response mode | Generated command runs the runtime in the request. | A slow provider consumes the caller’s request budget. |
| `setResponseMode(...)` | Intended generated command behavior is queue acceptance with `jobId`, `runId`, and `status`. | A queue job ID is delivery identity, not a durable workflow identity. Current Core output-schema validation conflicts with the acceptance result, so this path needs an implementation repair before production use with an output schema. |
| `exposeAsHttpEndpoint(..., { streamingMode: 'aggregate' })` | The HTTP server exposes the generated command. | Server registration, authentication, and topology remain HTTP-owned. |
| `exposeAsHttpEndpoint(..., { streamingMode: 'stream' })` | The HTTP server exposes the generated stream. | A stream is for a live connection, not disconnect-safe completion. |

The generated worker delivers `success` only after the attached runtime returns
validated output. A cancelled/failed model or tool execution follows the normal
queue and adapter failure path. [Queues and workers](/handbook/framework/build-services/queues-and-workers/)
own retry, leasing, and bridge guarantees.

Next: [build the first attached agent](/handbook/framework/build-ai-powered-services/build-the-first-attached-agent/).
