# Streaming Requirements

## Product requirements

- Support data streams in addition to plain request-response.
- Support incremental output (server to client).
- Support bi-directional flow where transport allows it.
- Provide cancellation and timeout semantics.
- Provide resumability strategy when possible.
- HTTP exposure should support SSE responses (streaming) similar to command HTTP exposure.

## Technical requirements

- Stream identity must be unique per invocation and per instance.
- No cross-talk between concurrent streams.
- Backpressure behavior must be explicit.
- Stream lifecycle must be observable (start/chunk/end/error/cancel).
- Must integrate with current command/subscription authorization and hooks.

## Typing requirements

- Typed stream item schema for input and output chunks.
- Typed metadata envelope for stream events.
- No accidental fallback to `unknown` in public API.
- Allow disabling per-chunk runtime schema validation while keeping compile-time types (performance toggle).
- Optional final aggregate result should be schema-driven and optionally emitted as a subscribable event.

## Compatibility requirements

- Bridge capability detection (streaming native vs emulated).
- Graceful fallback for non-streaming bridges.
- Clear runtime errors for unsupported stream modes.
