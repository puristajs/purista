---
title: Stream
description: Add streaming functions with typed chunks, final payload aggregation and SSE exposure.
order: 202500
---

# Stream

Streams are long-running request/response functions that return multiple frames (`start`, `chunk`, `complete`, `error`, `cancel`) instead of a single payload. Use them for incremental delivery, token-by-token AI responses, progress feeds, or any flow that maps well to Server-Sent Events (SSE).

A command returns one response when it finishes. A stream returns many responses while it runs. If you are generating a report that can show progress, pinging a host repeatedly and feeding back latency readings, or forwarding AI-generated tokens to a browser as they arrive, a stream lets the client start consuming immediately rather than waiting for the full result. The tradeoff is added complexity: consumers must handle all five frame types (`start`, `chunk`, `complete`, `error`, `cancel`), and every stream must emit a terminal frame or consumers will hang indefinitely.

Within the PURISTA model, a stream still routes through the event bridge just like a command. The caller invokes it, guards run, and the stream function executes — but instead of resolving to a single message, the function emits frames until it calls `context.stream.complete(...)`, `context.stream.error(...)`, or `context.stream.cancel(...)`. Downstream services and HTTP clients both consume frames the same way, so the business logic is written once regardless of transport.

## Stream vs command vs subscription

These three building blocks overlap in their surface area, so it is worth being precise about which one to reach for. A **command** is the right choice when a caller sends input and needs exactly one response — a checkout command validates a cart, charges the customer, and returns an order ID. A **subscription** is the right choice when you want to react to something that already happened without the originator caring about the result — when `orderPlaced` fires, a subscription sends a confirmation email, but the checkout command does not wait for the email to be sent.

A **stream** sits in a different position. The caller is still waiting for a response, but the response is intentionally incremental. An AI summarisation endpoint that emits tokens as they are generated, a report builder that sends progress percentages while crunching data, or a file conversion job that streams processed chunks back to the client — these all fit the stream model. The key indicator is that the caller wants to *consume results while the work is still in progress*, rather than polling or receiving one final payload.

If you find yourself wanting a subscription but you need the caller to receive acknowledgement of each step, you are describing a stream. If you find yourself wanting a stream but the caller only ever reads the final payload and ignores intermediate chunks, a command with a slightly longer execution time is simpler and has less consumer-side complexity.

## Add a stream with the CLI

```bash
npm run add:stream
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
- [Test a stream](./test-a-stream.md)
- [Expose REST endpoints](../exposing_endpoints/rest_api_http_endpoints.md)
- [Subscription builder](../subscription/the-subscription-builder.md)
