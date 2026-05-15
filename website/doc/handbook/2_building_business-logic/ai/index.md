---
title: AI Agents
description: Build queue-backed AI agents and workflows with @purista/core.
order: 207000
---

# AI agents

PURISTA agents are core business-logic primitives from `@purista/core`, backed by `@purista/harness` for model calls, lower-level agent loops, workflows, tools, skills, memory, history, state, sandboxing, telemetry, and streaming events.

Use an AI agent when a service capability is model-driven, conversational, tool-loop oriented, or needs provider operations such as structured generation, embeddings, reranking, or multimodal input.

An attached PURISTA agent expands into normal PURISTA business-logic artifacts:

- a [queue](../queue/index.md) for controlled execution, retry, leases, and dead-letter behavior
- a queue worker that runs the agent
- a [command](../command/index.md) for aggregate request/response calls
- a [stream](../stream/index.md) for live run events

This is the most important design point: AI is not a separate application lane. It is declared as business logic and then operated through the same service, queue, command, stream, logging, OpenTelemetry, and HTTP exposure model as the rest of PURISTA.

## Provider packages

Agent builders and test helpers come from `@purista/core`. Core is provider-neutral; install provider packages only in applications that bind live model providers at runtime. For example, an OpenAI-backed application can add:

::: code-group

```bash [npm]
npm install @purista/harness-openai
```

```bash [bun]
bun add @purista/harness-openai
```

```bash [yarn]
yarn add @purista/harness-openai
```

```bash [pnpm]
pnpm add @purista/harness-openai
```

:::

The service definition declares aliases and required capabilities. The application runtime supplies concrete provider instances, credentials, model names, and endpoint options.

## Mental model

```mermaid
flowchart TD
  Service["PURISTA service"] --> AgentBuilder["getAgentQueueBuilder"]
  AgentBuilder --> Queue["generated queue"]
  AgentBuilder --> Worker["generated queue worker"]
  AgentBuilder --> Command["generated command"]
  AgentBuilder --> Stream["generated stream"]
  Worker --> Harness["@purista/harness session"]
  Command --> Harness
  Stream --> Harness
  Harness --> InnerAgent["harness agent loop"]
  Harness --> InnerWorkflow["harness workflow"]
  InnerWorkflow --> InnerAgent
  Harness --> Models["model providers"]
  Harness --> Sandbox["sandbox"]
  Harness --> State["state store"]
```

There are two orchestration levels:

| Level | What runs there | Isolation boundary |
| --- | --- | --- |
| Harness level | One harness agent loop or one harness workflow. A workflow can combine multiple harness agents inside the same harness session and sandbox instance. | One harness session and sandbox for that attached PURISTA agent run. |
| PURISTA level | Queue-backed agents, commands, streams, and other services invoke each other through declared boundaries. | Each attached agent is its own PURISTA runtime capability and can have its own queue, lifecycle, model bindings, state store, and sandbox. |

Use the harness level for tightly coupled reasoning steps that should share one session, memory, history, and sandbox. Use the PURISTA level for larger business workflows where independent agents need their own queue lifecycle, retries, ownership boundaries, and operational isolation.

## When to use

- You need structured AI output validated by Zod schemas.
- A user-facing or background workflow needs a model conversation loop.
- The model should call allowlisted PURISTA commands or child agents.
- You need retrieval flows with embeddings and reranking.
- You need streaming progress or model/tool lifecycle events.
- Work is slow or expensive and should run through queue leases, retries, and dead-letter handling.
- Different AI steps need separate service ownership, queue policies, model bindings, or sandbox isolation.

Keep deterministic business truth in commands, subscriptions, queues, stores, and resources. Agent output should become canonical only after deterministic service logic validates and applies it.

## Execution shapes

Each attached agent uses exactly one execution definition:

| Method | Use when |
| --- | --- |
| `setRunFunction(...)` | You want a typed PURISTA handler that calls harness model operations, PURISTA command tools, child agents, resources, queues, streams, and stores directly. |
| `setHarnessAgent(...)` | You already have one reusable `@purista/harness` agent definition and want PURISTA to expose it as a queue-backed service capability. |
| `setHarnessWorkflow(...)` | You already have one reusable `@purista/harness` workflow that coordinates multiple harness agents inside one session and sandbox. |

Start with `setRunFunction(...)` when you are building normal PURISTA application code. Use harness agent/workflow definitions when you want the lower-level harness loop or workflow semantics directly.

The repository example at `examples/agent-example` shows the smallest
provider-neutral version of this flow with `createAgentTestHarness(...)` and a
scripted model provider.

## Typical implementation order

1. Create the service with `ServiceBuilder` from `@purista/core`.
2. Add an agent builder with `getAgentQueueBuilder(agentName, description)`.
3. Add payload, parameter, and output schemas.
4. Declare model aliases with the smallest required capabilities.
5. Declare command tools, child agents, skills, built-in tools, session policy, and sandbox policy as needed.
6. Choose one execution definition: `setRunFunction`, `setHarnessAgent`, or `setHarnessWorkflow`.
7. Add HTTP exposure, streaming mode, execution policy, or long-running response mode if needed.
8. Add the attached agent definition to the service.
9. Instantiate the service with `queueBridge` and `ai.models`.
10. Test with `@purista/core/testing` fake providers before any live-provider smoke test.

## Smallest useful agent

```ts
import { ServiceBuilder } from '@purista/core'
import { z } from 'zod'

export const supportService = new ServiceBuilder({
  serviceName: 'support',
  serviceVersion: '1',
  serviceDescription: 'Support workflows',
})

const triageAgent = await supportService
  .getAgentQueueBuilder('triage', 'Classifies incoming support tickets')
  .addPayloadSchema(z.object({
    ticketId: z.string(),
    text: z.string(),
  }))
  .addOutputSchema(z.object({
    priority: z.enum(['low', 'normal', 'high']),
    reason: z.string(),
  }))
  .addModel('primary', {
    model: 'support-fast',
    capabilities: ['object'],
    defaults: { temperature: 0 },
  })
  .setRunFunction(async context => {
    const result = await context.harness.models.primary.object(
      {
        messages: [{
          role: 'user',
          content: `Classify ticket ${context.payload.ticketId}: ${context.payload.text}`,
        }],
        schema: {
          type: 'object',
          properties: {
            priority: { enum: ['low', 'normal', 'high'] },
            reason: { type: 'string' },
          },
          required: ['priority', 'reason'],
        },
      },
      context.signal,
    )

    return result.object
  })
  .getDefinition()

supportService.addAgentDefinition(triageAgent)
```

## Runtime wiring

Agents require a `queueBridge` and runtime model bindings:

```ts
const service = await supportService.getInstance(eventBridge, {
  queueBridge,
  logger,
  ai: {
    models: {
      primary: {
        provider,
        model: 'gpt-4.1-mini',
        capabilities: ['object'],
      },
    },
    telemetry: {
      captureContent: false,
    },
  },
})

await service.start()
```

Startup fails when:

- `queueBridge` is missing for a service with attached agents
- `ai.models` is missing
- a declared model alias is not bound at runtime
- runtime model capabilities do not satisfy declared alias capabilities

This fail-fast behavior prevents a production service from silently degrading to a weaker model or transport guarantee.

## Real-world use cases

### Support triage

Use one queue-backed agent to classify tickets, enrich them through command tools, and emit a validated result.

- Agent shape: `setRunFunction(...)`
- Model capabilities: `object`
- PURISTA tools: `canInvoke('crm', '1', 'getCustomer')`, `canInvoke('ticketing', '1', 'updatePriority')`
- Production behavior: short queue lease, low retry budget, final success/failure events

### Source-grounded answer service

Use embeddings and rerank operations to retrieve evidence, then pass selected passages to an answer agent.

- Agent shape: `setRunFunction(...)` or `setHarnessWorkflow(...)`
- Model capabilities: `embeddings`, `rerank`, `object`
- Business boundary: vector index is an application resource; the model provider only creates vectors and ranking scores
- Output: answer, citations, confidence, missing-context notes

### Incident report workflow

Use a harness workflow when one run should keep a shared sandbox and memory while several inner agents collaborate on the same evidence set.

- Inner harness agents: timeline extractor, impact assessor, remediation writer
- One harness workflow: calls those inner agents in sequence or parallel inside the same session
- PURISTA wrapper: one queue-backed `incidentReport` agent
- Output: report draft plus explicit follow-up actions

### Multi-agent product review

Use PURISTA-level orchestration when agents need independent runtime boundaries.

- Parent PURISTA agent: `productReview`
- Child PURISTA agents: `requirementsReview`, `architectureReview`, `securityReview`, `testReview`
- Each child has its own queue, model binding, sandbox, retry policy, and stream
- Parent combines validated child outputs and applies deterministic readiness rules

## What to read next

- [The agent builder](./the-agent-builder.md)
- [Harness agents and workflows](./harness-agents-and-workflows.md)
- [Model capabilities](./model-capabilities.md)
- [Test an agent](./test-an-agent.md)
- [Queues](../queue/index.md)
- [Streams](../stream/index.md)

## Common pitfalls

- Treating a model response as canonical state without deterministic validation.
- Putting broad service clients directly into prompts instead of allowlisting command tools.
- Declaring model capabilities the concrete provider or model does not support.
- Using one huge agent for work that needs independent queues, retries, ownership, or sandboxes.
- Using PURISTA child-agent orchestration for tiny inner reasoning steps that should share one harness session.
- Reusing `correlationId` as an AI conversation id.
- Hitting real model providers from unit tests.

## Checklist

- payload, parameter, and output schemas are defined
- one execution definition is selected
- model aliases declare only required capabilities
- runtime `ai.models` bindings satisfy those capabilities
- `queueBridge` is supplied at service instantiation
- command tools and child agents are explicitly allowlisted
- session identity is deliberate (`ephemeral` or `conversation`)
- long-running work uses queue execution profile and response mode
- unit tests use fake providers from `@purista/core/testing`
