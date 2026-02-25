# Streaming Core Interfaces (Draft)

Goal: define the minimal public surface area for streaming that fits Purista's existing model and preserves typing (no `any`/`unknown` leaks).

## Key design constraints

- Works across multiple event bridge transports.
- Prevent stream cross-talk across instances.
- Gives users a consistent consumer API (AsyncIterator) regardless of transport.
- Keeps streaming frames schema-driven and typed like existing payload/params/output schemas.
- Keeps streaming write APIs distinct from event `emit` terminology (use `write`, `close`, `fail`, `cancel`).

## Stream identifiers

```ts
export type StreamSessionId = string
export type StreamSequence = number

export type StreamOwner = {
  serviceName: string
  serviceVersion: string
  serviceTarget: string
  instanceId: string
}
```

## Stream envelope (transport-agnostic)

```ts
export type StreamFrameType = 'start' | 'chunk' | 'complete' | 'error' | 'cancel' | 'heartbeat'

export type StreamEnvelope<TChunk, TError = unknown, TMeta = Record<string, never>> = Readonly<{
  sessionId: StreamSessionId
  sequence: StreamSequence
  type: StreamFrameType
  timestamp: number
  owner: StreamOwner
  payload?: TChunk
  error?: TError
  meta?: TMeta
}>
```

Notes:
- `owner.instanceId` is required for instance isolation and routing.
- `sequence` exists even if the transport is unordered; consumers can enforce ordering or tolerate gaps.

## Stream API surface (consumer side)

```ts
export interface StreamHandle<TChunk> extends AsyncIterable<StreamEnvelope<TChunk>> {
  readonly sessionId: StreamSessionId
  cancel(reason?: string): Promise<void>
}
```

## Stream API surface (producer side)

Producer-side functions must be strongly typed and explicit about lifecycle.

```ts
export interface StreamWriter<TChunk, TFinal = undefined> {
  write(chunk: TChunk): Promise<void>
  close(final?: TFinal): Promise<void>
  fail(error: unknown): Promise<void>
  onCancel(cb: (reason?: string) => void): void
  readonly cancelled: boolean
}
```

## Event bridge capability model

We need explicit capability checks. Not every bridge will support streaming natively.

```ts
export type StreamCapability =
  | 'stream-unidirectional'   // server -> client only
  | 'stream-bidirectional'    // client <-> server
  | 'stream-ordered'          // preserves order per session
  | 'stream-backpressure'     // supports flow control beyond best effort
  | 'stream-cancel'           // can propagate cancel to producer

export interface StreamingEventBridgeCapabilities {
  readonly stream: ReadonlySet<StreamCapability>
}
```

## Event bridge interface extension (draft)

We should avoid breaking the existing `EventBridge` contract. Preferred is an opt-in extension interface.

```ts
export interface StreamingEventBridge {
  readonly capabilities: StreamingEventBridgeCapabilities

  openStream<TChunk>(input: {
    owner: StreamOwner
    ttl?: number
  }): Promise<StreamHandle<TChunk>>
}
```

Bridge-specific implementations can map `openStream` onto:
- native streaming constructs (where available), or
- an emulation layer using message frames on per-session topics/subjects/queues.

## Transport mapping: frame -> message

Decision (recommended for v1):
- Add a new `EBMessageType.Stream = 'stream'` and represent open/frames/control as stream messages.
- Use `CustomMessage` only for the optional *final aggregate event* when `finalEventName` is configured (to integrate with subscriptions).

Rationale:
- Avoids accidental matching by business subscriptions.
- Keeps routing explicit and bridge implementations simpler.

See `todo/10-streaming/70-production-spec-v1.md` for the wire protocol draft.

## Context integration (invoke-like)

Current Purista contexts expose invocations via `context.service` (typed by `canInvoke` and backed by `createInvokeFunctionProxy`).

Streaming needs a parallel mechanism to open stream requests from:
- command contexts
- subscription contexts

Draft additions (non-breaking, additive):

```ts
export type StreamInvokeList = Record<string, unknown> // same shape idea as InvokeList, but stream-returning

export type StreamCommandContextEnhancements<Streams extends StreamInvokeList = StreamInvokeList> = {
  stream: Streams
}
```

Naming:
- Use `context.stream` for opening/consuming streams.
- Keep `context.emit` reserved for custom events, not stream writes.


## Minimal lifecycle guarantees (v1)

- `start` is always the first frame per session.
- `complete` or `error` terminates the session.
- `cancel` may terminate or be best-effort depending on bridge capabilities.
