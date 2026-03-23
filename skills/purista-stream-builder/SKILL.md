---
name: purista-stream-builder
description: Teach untrained models how to define PURISTA streams with getStreamBuilder, streaming schemas, stream functions, service assembly, and runtime exposure.
topics: [streams, http, ui]
phases: [architecture, implementation]
---

# PURISTA Stream Builder

## When to use this skill
Use this skill when the user experience requires incremental output, live telemetry, or server-sent updates.

## What this component/package is for
Streams expose long-lived, incremental responses without forcing the whole workflow into one final payload.

## Core PURISTA concept
A stream is a builder-defined contract owned by a service. It describes input, chunk, and final output shapes, implements incremental delivery, and can later be exposed over transports such as SSE.

## Builder lifecycle
1. Start from the owning service builder.
2. Create the builder with `getStreamBuilder(...)`.
3. Attach schemas with `addPayloadSchema(...)`, `addParameterSchema(...)`, `addChunkSchema(...)`, and `addFinalSchema(...)` as needed.
4. Add optional transport exposure metadata such as `exposeAsHttpStreamEndpoint(...)`.
5. Implement streaming behavior with `setStreamFunction(...)`.
6. Call `getDefinition()`.
7. Register the definition with `addStreamDefinition(...)`.
8. Instantiate the owning service with `getInstance(...)`.

## Hard rules
- Keep stream contracts explicit and stable.
- Emit meaningful partial updates; do not spam noise.
- Separate stream transport from durable execution semantics.
- Preserve final state outside the stream if recovery matters.

## Decision rules
- Use a stream when the user benefits from progress or partial content.
- Pair streams with queues and run-state if the work must survive disconnects.
- Keep streaming as a delivery shape; do not confuse it with workflow durability.

## Definition pattern
```text
src/service/<service-name>/v1/stream/<stream-name>/
  <streamName>StreamBuilder.ts
  schema.ts
```

## Implementation pattern
- Stream deltas, protocol envelopes, or partial artifacts explicitly.
- Use the stream writer inside `setStreamFunction(...)`.
- Keep long-running orchestration in queues or agents when disconnect recovery matters.

## Configuration pattern
- Streams inherit service-owned config and resources from the owning service.
- HTTP or SSE exposure metadata belongs on the stream builder, but the actual HTTP server is wired separately at runtime.

## Instantiation / runtime wiring
- A stream only runs as part of a service instance created with `getInstance(...)`.
- If the stream is exposed over HTTP, the HTTP runtime wraps the stream definition; it does not replace it.
- Runtime wiring must still provide EventBridge, logger, resources, and any queue-backed dependencies.

## Verification cues
- The stream builder is derived from the service builder and registered with `addStreamDefinition(...)`.
- Chunk and final schemas are explicit when the stream carries structured data.
- The design can explain whether the stream is inline-only or backed by durable state elsewhere.
- A reviewer can point to the service instance and optional transport wrapper that expose the stream.

## Common mistakes / anti-patterns
- Treating streaming as durability.
- Sending huge repeated snapshots instead of meaningful deltas.
- Mixing stream state and workflow state.
- Explaining only the writer logic without the service definition, registration, and runtime wiring.

## How this connects to other PURISTA concepts
Streams connect to service builders, HTTP runtime, agents, protocol rendering, and queue-backed durable work.

## Related skills
- `purista-service-builder` for the owning service lifecycle
- `purista-schema-contracts` for payload, chunk, and final schemas
- `purista-http-runtime` for SSE and transport exposure
- `purista-agent-runtime` for protocol-driven streams
- `purista-queue-builder` for durable work behind streaming UIs

## Read if needed
- `packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts`
- `examples/ai-basic/src/service/support/v1/stream/runSupportAgentStream/runSupportAgentStreamBuilder.ts`
- `examples/ai-basic/src/service/support/v1/supportV1Service.ts`
- `specs/10-streaming/50-http-sse-exposure.md`
- `website/doc/handbook/2_building_business-logic/agent/frontend.md`
