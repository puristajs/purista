# Context, Invocations, and Events (Draft)

This document focuses on:
- how to open a stream from command/subscription contexts (invoke-like)
- how stream lifecycle relates to custom events and subscriptions
- message-schema implications

## 1) Open a stream from contexts (invoke-like)

Today:
- `CommandFunctionContext.service` is typed by `.canInvoke(...)` and implemented via `createInvokeFunctionProxy(...)`.
- Same pattern exists for subscriptions.

We need the same DX for streams:
- no manual address strings in user code
- schema-driven typing for payload/params/chunks/final

### Proposed context shape additions

Add a new property alongside `service`:

```ts
type CommandFunctionContextEnhancements<..., Invokes, ..., StreamInvokes> = {
  service: Invokes
  stream: StreamInvokes
}
```

Naming rationale:
- `service` already means request-response invocations.
- `stream` is for opening/consuming streaming invocations.

### Proposed StreamInvokes shape

Mirror the existing nested invoke addressing:

```ts
// Example call site
const s = await context.stream.UserService['1'].searchUsers(payload, params)

for await (const frame of s) {
  // frame.payload typed as Chunk
}

await s.cancel()
```

Return type options:
1. `StreamHandle<Chunk>` yielding `StreamEnvelope<Chunk>`
2. `AsyncIterable<Chunk>` yielding chunk payload only

Recommendation:
- return `StreamHandle<Chunk>` as the primitive (keeps metadata available, allows cancel).
- provide a helper to map to payload-only async iterator for convenience.

### Declaring stream invocations in builders

The caller side does not “stream”, it “opens/consumes” a stream. So the method should reflect that.

Add a `.canConsumeStream(...)` method (and optionally to Command/Subscription builders, symmetric to `canInvoke`):

```ts
.canConsumeStream('UserService', '1', 'searchUsers', chunkSchema, payloadSchema?, paramsSchema?, finalSchema?)
```

This creates the strongly typed `context.stream.UserService['1'].searchUsers(...)` function.

## 2) Producer-side stream writing

Producer handlers need a stream writer that is:
- strongly typed (`ChunkSchema`, `FinalSchema`)
- not named `emit`

Proposed naming in handler context:
- `writer.write(chunk)`
- `writer.close(final?)`
- `writer.fail(error)`

This is intentionally distinct from `context.emit` (custom events).

## 3) Event names, subscriptions, and 1:N concerns

There are two different concepts that are easy to mix up:

### A) Invocation stream (1 caller -> 1 session)

- A caller opens a stream session.
- Only that caller consumes the stream.
- Routing keys include `sessionId` and `owner.instanceId` to prevent cross-talk across instances.

This is the v1 focus and is closest to a "command with streaming response".

### B) Broadcast stream (1 producer -> N subscribers)

- Producer publishes chunks as events.
- Many consumers subscribe (like regular Purista subscriptions).
- No per-caller session is needed; a topic/subject is enough.

This is not "open a stream" from a context. It is closer to `emit`-ing chunk events.

### How to bridge A into existing subscription model

If chunk aggregation + final event name is enabled, the stream behaves like a command completion:
- the final aggregate is emitted with `eventName`
- subscriptions can pick it up using the existing event filters

Optional:
- add `setChunkEventName(...)` or `broadcastChunksAsEvents(...)`
  - emits each chunk as a `CustomMessage` event
  - enables 1:N chunk consumption
  - must be explicit because it changes scaling and delivery semantics

## 4) Message schema implications

We need a way to send stream frames over the event bridge.

Two viable approaches:

1. Add a new `EBMessageType` for stream frames:
   - clearer separation
   - requires updating parsing/validation in bridges
2. Encode frames as `CustomMessage` with reserved `eventName` and strict payload schema:
   - avoids expanding message types
   - must guarantee subscriptions don't accidentally match frames

Recommendation:
- prefer a dedicated message type for stream frames (cleaner and safer),
- but gate it behind a non-breaking extension strategy where possible.

## 5) Error handling

Invocation streams must support:
- transport-level disconnects
- producer errors
- validation errors (when enabled)

Wire behavior:
- send an `error` frame and terminate the stream
- ensure the caller can distinguish "stream closed normally" vs "failed"

Cancel behavior (v1):
- send a terminal `cancel` frame and terminate the stream
- consumers must treat cancel as a distinct terminal state (not an error)
