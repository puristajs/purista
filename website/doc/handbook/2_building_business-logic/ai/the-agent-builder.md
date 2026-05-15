---
title: The Agent Builder
description: Declare PURISTA AI agents, generated queues, commands, streams, models, tools, and runtime policies.
order: 207010
---

# The agent builder

Use `serviceBuilder.getAgentQueueBuilder(agentName, description)` to attach an AI agent to a service.

```ts
const agent = supportService.getAgentQueueBuilder(
  'triage',
  'Classifies incoming support tickets',
)
```

The builder collects the AI contract and generates four core definitions: queue, queue worker, command, and stream.

## Service builder

Import `@purista/ai` once to register the AI builder extension, but keep `ServiceBuilder` from `@purista/core`:

```ts
import '@purista/ai'
import { ServiceBuilder } from '@purista/core'

export const supportService = new ServiceBuilder({
  serviceName: 'support',
  serviceVersion: '1',
  serviceDescription: 'Support workflows',
})
```

You can still add normal commands, subscriptions, streams, resources, stores, and config to the same service.

## Schemas

Agents follow the same schema pattern as commands, streams, and queues.

```ts
const triageAgent = supportService
  .getAgentQueueBuilder('triage', 'Classifies incoming support tickets')
  .addPayloadSchema(z.object({
    ticketId: z.string(),
    text: z.string(),
  }))
  .addParameterSchema(z.object({
    dryRun: z.boolean().optional(),
  }))
  .addOutputSchema(z.object({
    priority: z.enum(['low', 'normal', 'high']),
    reason: z.string(),
  }))
```

The schemas drive runtime validation and TypeScript inference for the handler context.

## Models

Declare model aliases on the agent definition. Bind concrete providers when the service starts.

```ts
.addModel('primary', {
  model: 'support-fast',
  capabilities: ['object', 'tool_use'],
  defaults: {
    temperature: 0,
    maxTokens: 1200,
  },
})
```

The alias is available as `context.harness.models.primary`. The type system exposes only methods supported by the declared capabilities.

## Run function

`setRunFunction(...)` is the normal PURISTA application path. The handler receives validated input, PURISTA application context, harness model handles, event helpers, command tools, child agents, logger, and cancellation signal.

```ts
.setRunFunction(async context => {
  context.logger.info({ ticketId: context.payload.ticketId }, 'Triage started')

  const result = await context.harness.models.primary.object(
    {
      messages: [{
        role: 'user',
        content: context.payload.text,
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
```

Use `context.signal` for model calls, child-agent calls, command tools, and long-running resource operations.

## Command tools

Agents can call allowlisted PURISTA commands. This is how you expose deterministic business operations to an AI workflow.

```ts
const triageAgent = await supportService
  .getAgentQueueBuilder('triage', 'Classifies incoming support tickets')
  .canInvoke('customer', '1', 'getProfile', {
    payloadSchema: z.object({ customerId: z.string() }),
    outputSchema: z.object({
      tier: z.enum(['standard', 'enterprise']),
      openIncidents: z.number(),
    }),
  })
  .setRunFunction(async context => {
    const profile = await context.invoke.tools['customer.1.getProfile'].call({
      customerId: context.payload.customerId,
    })

    return {
      priority: profile.tier === 'enterprise' ? 'high' : 'normal',
      reason: `customer tier is ${profile.tier}`,
    }
  })
  .getDefinition()
```

Do not pass broad service clients into prompts. Keep each callable business operation behind an explicit command declaration.

## Child agents

Agents can call other PURISTA agents through command boundaries.

```ts
.canInvokeAgent('securityReview', '1', {
  payloadSchema: z.object({ changeSet: z.string() }),
  outputSchema: z.object({
    risk: z.enum(['low', 'medium', 'high']),
    notes: z.array(z.string()),
  }),
})
.setRunFunction(async context => {
  const security = await context.invoke.agents['securityReview.1'].run({
    changeSet: context.payload.changeSet,
  })

  return {
    approved: security.risk !== 'high',
    security,
  }
})
```

Use child agents when each AI capability should keep its own queue, retry behavior, model binding, sandbox, owner, or deployment boundary.

## Skills and built-in tools

Harness skills are mounted instruction directories. Use them when an agent needs reusable method or domain guidance.

```ts
.useSkills(['incident-responder'])
.useBuiltInTools(['read', 'list', 'grep'])
```

Built-in tools default to enabled at the harness level. For production agents, prefer the smallest useful set. If a skill needs supporting files, keep read-only built-ins such as `read`, `list`, and `grep` enabled so the model can inspect mounted skill content.

## Session policy

Transport metadata and AI conversation identity are separate.

| Identifier | Meaning |
| --- | --- |
| `message.id` | transport message id |
| `traceId` | tracing id |
| `correlationId` | transport correlation id |
| `runId` | one agent execution |
| `harnessSessionId` | harness session identity |

By default, agents use an ephemeral session derived from the transport message. Use `setSessionPolicy(...)` when an agent should continue a logical conversation across calls.

```ts
.setSessionPolicy({
  mode: 'conversation',
  payloadPath: ['conversation', 'id'],
})
```

With this policy, `payload.conversation.id` becomes the harness session id. Do not treat `correlationId` as a conversation id.

## Sandbox policy

Use `setSandboxPolicy(...)` when the agent needs an explicit sandbox adapter.

```ts
.setSandboxPolicy({
  enabled: true,
})
```

At runtime, the service can also receive an AI sandbox adapter:

```ts
const service = await supportService.getInstance(eventBridge, {
  queueBridge,
  ai: {
    sandbox,
    models,
  },
})
```

Sandbox requirements depend on what the harness agent or workflow does. Read-only prompt and model calls do not need shell execution. Built-in filesystem tools, MCP stdio tools, code execution, and mounted skills need a sandbox with matching capabilities.

## HTTP exposure and streaming

Expose the generated stream or command through HTTP:

```ts
.exposeAsHttpEndpoint('POST', '/agents/triage', {
  streamingMode: 'stream',
})
```

`streamingMode: 'stream'` exposes server-sent events. Chunks validate against `agentSseEventSchema` and include provider-familiar semantic event names in `data.type`, for example:

- `response.created`
- `response.output_text.delta`
- `response.output_json.delta`
- `response.tool_call.started`
- `response.tool_call.completed`
- `response.model_embedding.completed`
- `response.model_rerank.completed`
- `response.completed`
- `error`

Use `streamingMode: 'aggregate'` when the endpoint should return the final validated output instead of incremental chunks.

## Queue and long-running behavior

Use execution policy for normal queue lifecycle settings:

```ts
.setExecutionPolicy({
  leaseTtlMs: 120_000,
  heartbeatIntervalMs: 30_000,
  maxAttempts: 3,
  maxParallelHandlers: 2,
  timeoutMs: 180_000,
})
```

For slow or expensive agent work, use the long-running queue profile and an async response mode:

```ts
.setExecutionProfile('longRunning', {
  maxRuntimeMs: 30 * 60_000,
  strict: true,
})
.setResponseMode('accepted', {
  resultPolicy: 'state-and-event',
  statusUrl: '/jobs/{jobId}',
  streamUrl: '/jobs/{jobId}/events',
})
```

Keep `jobId` and `runId` separate:

- `jobId` owns queue lease, retry, metrics, and dead-letter state
- `runId` owns the AI execution

See [Async agent queues](../../6_integrations/enterprise_interoperability/async-agent-queues.md) for the enterprise queue contract.

## Add definition to the service

```ts
supportService.addAgentDefinition(await triageAgent.getDefinition())
```

The service must be instantiated with a queue bridge and AI model bindings:

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
```

## Checklist

- payload, parameter, and output schemas are defined
- exactly one execution definition is set
- model capabilities match the handler calls
- command tools and child agents are explicitly allowlisted
- session and sandbox policy are deliberate
- long-running work has queue and response policy
- runtime bindings include `queueBridge` and `ai.models`
