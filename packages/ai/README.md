# `@purista/ai`

Harness-backed AI agents for PURISTA services.

`@purista/ai` is an optional package. Core PURISTA packages, HTTP adapters,
default starters, and scaffolding runtime code must not depend on it. Install it
only in applications that declare agents.

## Runtime Model

The package wraps `@purista/harness` and exposes agents as normal PURISTA service
artifacts:

- a queue for controlled concurrency
- a worker for background execution
- a command for aggregate calls
- a stream for live harness run events

Agents can execute one of three mutually exclusive definitions:

- `setHarnessAgent(...)`
- `setHarnessWorkflow(...)`
- `setRunFunction(...)`

The runtime emits harness `RunEvent` values. It does not emit a PURISTA-specific
AI protocol envelope and it does not adapt streams to Vercel AI SDK message
formats.

HTTP stream endpoints emit standard SSE `event`/`data` frames. The `data`
payload follows provider-familiar semantic event names such as
`response.created`, `response.output_text.delta`, `response.output_json.delta`,
and `response.completed`, with `type` and `sequence_number` fields included in
each chunk.

## Builder

```ts
import '@purista/ai'
import { ServiceBuilder } from '@purista/core'
import { z } from 'zod'

export const supportService = new ServiceBuilder({
  serviceName: 'support',
  serviceVersion: '1',
  serviceDescription: 'Support service',
})

export const triageAgent = supportService
  .getAgentQueueBuilder('triage', 'Classifies incoming support tickets')
  .addPayloadSchema(z.object({ text: z.string() }))
  .addOutputSchema(z.object({ priority: z.enum(['low', 'normal', 'high']) }))
  .addModel('primary', {
    model: 'support-fast',
    capabilities: ['text', 'object'],
  })
  .setRunFunction(async context => {
    const result = await context.harness.models.primary.object(
      {
        messages: [{ role: 'user', content: context.payload.text }],
        schema: {
          type: 'object',
          properties: { priority: { enum: ['low', 'normal', 'high'] } },
          required: ['priority'],
        },
      },
      context.signal,
    )

    return result.object
  })
```

Builder declarations cascade into handler types:

- payload, parameter, and output schemas infer handler input/output types
- declared model aliases become `context.harness.models.<alias>`
- model methods are capability-gated by the declared alias capabilities
- allowlisted command tools and child agents become typed invoke maps

## Service Instantiation

Applications bind concrete harness providers at service startup:

```ts
const instance = await supportService
  .addAgentDefinition(await triageAgent.getDefinition())
  .getInstance(eventBridge, {
    queueBridge,
    ai: {
      telemetry: {
        captureContent: false,
      },
      models: {
        primary: {
          provider,
          model: 'gpt-4.1-mini',
        },
      },
    },
  })
```

Startup fails fast when a declared alias is missing or the runtime provider does
not satisfy the required capabilities.

## Testing

Use `@purista/ai/testing` for credential-free tests:

```ts
import { createAgentTestHarness, createScriptedHarnessModel } from '@purista/ai/testing'

const model = createScriptedHarnessModel()

model.enqueueObject({
  object: { priority: 'high' },
  usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
  finishReason: 'stop',
})

const harness = createAgentTestHarness(await triageAgent.getDefinition(), {
  models: {
    primary: {
      provider: model,
      model: 'gpt-4.1-mini',
      capabilities: ['object'],
    },
  },
})

const output = await harness.run({ payload: { text: 'urgent customer issue' } })
```

Tests should assert harness events and validated final output, not transport
protocol envelopes.

## Stream Events

`agentSseEventSchema` describes the chunk payload exposed in OpenAPI for AI
stream endpoints. It supports text deltas, JSON/object deltas, tool lifecycle
events, embedding/rerank completion events, errors, and final response
completion.

```ts
import { agentContentPartSchema, agentSseEventSchema } from '@purista/ai'

agentContentPartSchema.parse({
  kind: 'image_url',
  url: 'https://example.com/image.png',
})
```
