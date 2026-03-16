---
title: The Stream Builder
description: Define typed stream payloads, chunk/final schemas, stream consumers, and SSE endpoints.
order: 202510
---

# The Stream Builder

Use `serviceBuilder.getStreamBuilder(...)` to define a stream function.

Scaffold a stream with:

```bash
purista add stream
```

## Minimal example

```ts
import { z } from 'zod'
import { serviceBuilder } from '../yourServiceBuilder.js'

const chunkSchema = z.object({
  token: z.string(),
})

const finalSchema = z.object({
  chunkCount: z.number(),
  chunks: z.array(chunkSchema),
})

export const generateTextStream = serviceBuilder
  .getStreamBuilder('generateText', 'Stream generated text tokens', 'textGenerationCompleted')
  .addPayloadSchema(z.object({ prompt: z.string().min(1) }))
  .addParameterSchema(z.object({ model: z.string().default('gpt-4.1') }))
  .addChunkSchema(chunkSchema, true)
  .addFinalSchema(finalSchema, true)
  .canConsumeStream(
    'AiService',
    '1',
    'providerStream',
    chunkSchema,
    z.object({ prompt: z.string() }),
    z.object({ model: z.string() }),
    finalSchema,
  )
  .exposeAsHttpStreamEndpoint('POST', 'text/generate')
  .setStreamFunction(async function (context, payload, parameter, writer) {
    const upstream = await context.stream.AiService[1].providerStream(payload, parameter)
    for await (const frame of upstream) {
      if (frame.payload.frameType === 'chunk' && frame.payload.chunk) {
        await writer.write(frame.payload.chunk)
      }
      if (frame.payload.frameType === 'complete') {
        await writer.close(frame.payload.final)
      }
    }
  })
```

## Runtime context

A stream function receives:

- `context.service`: invoke command endpoints
- `context.stream`: consume other stream endpoints
- `context.emit`: emit custom events
- `context.resources`: typed service resources
- `writer`: stream writer (`write`, `close`, `fail`, `onCancel`)

## Validation and aggregation

- `addChunkSchema(schema, validateChunks = true)` validates each `writer.write(...)` payload.
- `addFinalSchema(schema, validateFinal = true)` validates `writer.close(final)`.
- If `enableChunkAggregation(true)` is set and no final payload is provided, PURISTA builds:
  - `{ chunkCount: number, chunks: Chunk[] }`

## HTTP/SSE exposure

Use `.exposeAsHttpStreamEndpoint(method, path)` to expose the stream via HTTP.

- response `content-type` is `text/event-stream`
- frames are sent as SSE events (`start`, `chunk`, `complete`, `error`, `cancel`)
- OpenAPI includes the stream frame schema and endpoint metadata

## Consume streams from commands/subscriptions

Commands and subscriptions can declare stream consumption contracts:

```ts
.canConsumeStream('SearchService', '1', 'searchUsers', chunkSchema, payloadSchema, parameterSchema, finalSchema)
```

Then consume them via:

```ts
const handle = await context.stream.SearchService[1].searchUsers(payload, parameter)
for await (const frame of handle) {
// handle frame.payload
}
```

## Invoke AI agents

Streams can invoke AI agents by declaring them as a dependency.

::: info Dependency required
To use agent invocation, the optional **`@purista/ai`** package must be installed in your project.
:::

```typescript
const builder = myServiceBuilder
.getStreamBuilder('chat', '...')
.canInvokeAgent('supportAgent', '1', {
  payloadSchema: z.object({ prompt: z.string() })
})
.setStreamFunction(async function (context, payload, parameter, writer) {
  const invocation = context.invokeAgent.supportAgent['1'].call({ 
    prompt: payload.prompt 
  })

  for await (const frame of invocation) {
    // Forward agent frames to stream writer
    await writer.write(frame)
  }

  const final = await invocation.final()
  await writer.close(final)
})
```

By using `.canInvokeAgent(...)`, you get:
- **Type Safety**: Full inference for payload and parameters.
- **Traceability**: Traces and correlation IDs flow automatically into the agent.
- **Metadata**: `principalId` and `tenantId` are forwarded to the agent.
- **Session**: `sessionId` is managed for conversation history.
## Testing streams

For unit tests, bind the stream function to the service instance and provide a writer stub:

```ts
const streamFn = safeBind(myStreamBuilder.getStreamFunction(), service)
const writer = {
  cancelled: false,
  write: vi.fn().mockResolvedValue(undefined),
  close: vi.fn().mockResolvedValue(undefined),
  fail: vi.fn().mockResolvedValue(undefined),
  onCancel: vi.fn(),
}

await streamFn(context, payload, parameter, writer)
```
