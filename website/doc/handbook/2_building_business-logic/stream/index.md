---
title: Stream
description: Add streaming functions with typed chunks, final payload aggregation and SSE exposure.
order: 202500
---

# Stream

Streams are long-running request/response functions that return multiple frames (`start`, `chunk`, `complete`, `error`, `cancel`) instead of a single payload. Use them for incremental delivery, token-by-token AI responses, progress feeds, or any flow that maps well to Server-Sent Events (SSE).

## Add a stream with the CLI

```bash
purista add stream
```

The generator scaffolds:

- stream builder (`getStreamBuilder`)
- schema file for input payload/parameter and chunk/final payloads
- optional command/REST exposure with `text/event-stream`
- Vitest snapshot covering frame emission

## Stream lifecycle

1. **Input phase** – optional transform + payload/parameter validation.
2. **Before guards** – enforce auth/authz/business preconditions.
3. **Execution** – emit frames via `context.stream`. Each call to `context.stream.chunk(...)` or `context.stream.complete(...)` is wrapped in telemetry spans.
4. **After guards / output transforms** – final adjustments once the stream finishes.
5. **Final frame** – `complete`, `error`, or `cancel` terminates the stream and informs subscribers/HTTP clients.

## Example

```ts
export const pingStreamBuilder = pingV1ServiceBuilder
  .getStreamBuilder('livePing', 'Continuously ping a target host')
  .addInputPayloadSchema(livePingInputPayloadSchema)
  .addChunkPayloadSchema(livePingChunkSchema)
  .addFinalPayloadSchema(livePingFinalSchema)
  .exposeAsHttpEndpoint('GET', 'ping/live', { contentTypeResponse: 'text/event-stream' })
  .setStreamFunction(async function (context, payload) {
    context.stream.start({ hostname: payload.hostname })
    for await (const latency of pingHost(payload.hostname)) {
      context.stream.chunk({ latency })
    }
    context.stream.complete({ averageLatency: context.metrics.latencyAvg })
  })
```

## Reliability notes

- Every stream has a `correlationId`. Include it in logs so clients can correlate SSE disconnects/retries.
- Consumers must handle `error` and `cancel` frames gracefully; cancellation is a normal control flow, not an unhandled exception.
- Per-chunk validation can be disabled for hot paths, but keep schemas defined for type inference and documentation.

## When to use

- You need incremental progress/results instead of one response body.
- Clients expect long-lived connections (SSE) with keep-alive frames.
- You are streaming AI tokens, telemetry updates, or chunked file conversions.

## Common pitfalls

- Forgetting to emit a terminal frame (handlers must call `complete`, `error`, or `cancel`).
- Mixing queue-style async work into streams (use queues when consumers pull jobs).
- Exposing streams via REST without setting the response content type to `text/event-stream`.

## Checklist

- Input, chunk, and final schemas defined.
- CLI scaffolding wired into the service builder.
- Guards validate auth/business constraints before opening the stream.
- SSE exposure configured with proper headers.
- Unit/integration tests simulate consumer disconnects and ensure terminal frames are sent.

## What to read next

- [The stream builder](./the-stream-builder.md)
- [Expose REST endpoints](../exposing_endpoints/rest_api_http_endpoints.md)
- [Subscription builder](../subscription/the-subscription-builder.md)
