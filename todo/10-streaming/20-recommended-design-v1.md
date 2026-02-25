# Recommended Streaming Design (v1)

## Core concepts

- `StreamSessionId`: unique per stream invocation.
- `StreamChunk<T>`: typed chunk envelope.
- `StreamControl`: cancel, ack, heartbeat.
- `StreamLifecycleEvent`: started, chunk, completed, failed, canceled, timeout.
- `StreamWriter<TChunk>`: producer-side write/close/fail surface (not called `emit`).

## API sketch

- `ServiceBuilder.getStreamBuilder(...)` to define streams similar to commands/subscriptions.
- `EventBridge.openStream(...)` / generated client `stream(...)` returning typed async iterator.
- Optional callback API for environments not friendly to async iterators.

## Envelope sketch

```ts
interface StreamEnvelope<TChunk, TMeta = Record<string, never>> {
  sessionId: string
  sequence: number
  type: 'chunk' | 'complete' | 'error' | 'control'
  timestamp: number
  payload?: TChunk
  meta?: TMeta
}
```

## Chunk schema + validation toggle

Builder should accept:
- `chunkSchema`
- `validateChunks` boolean (default `true`)

When `validateChunks = false`:
- TypeScript types still derive from schema.
- Runtime validation is skipped per chunk for performance.

## Optional aggregate final result (command-like)

We want an optional mode where the stream also behaves like a command completion:

- Aggregate chunks automatically (strategy to be defined).
- Emit one final aggregate:
  - as SSE final event on HTTP exposure
  - and optionally as a broker custom event (`eventName`) so subscriptions can pick it up

This keeps the stream ergonomic for interactive clients while enabling the existing subscription/event ecosystem.

## Instance isolation strategy

- Session owner instance ID must be part of stream routing key.
- Broker topic/subject key pattern includes `sessionId + ownerInstanceId`.
- Consumer validates owner before processing chunk/control frames.

## Scalability strategy

- Stateless routing + per-session ownership registry with TTL.
- Heartbeats to detect stale sessions.
- Explicit max concurrent streams per service instance.

## Bridge capability matrix (to define)

- AMQP
- NATS
- MQTT
- HTTP bridges
- Dapr pubsub

For each bridge:

- Native streaming support?
- Ordering guarantees?
- Max payload guidance?
- Backpressure strategy?
- Cancel propagation support?

## Open questions

- Is exactly-once chunk delivery required or at-least-once acceptable?
- Do we need resumable streams in v1?
- Should chunks be schema-validated by default or opt-in for performance?
- Should we allow broadcasting chunks as events (1 producer:N consumers), or keep v1 as invocation-only?
