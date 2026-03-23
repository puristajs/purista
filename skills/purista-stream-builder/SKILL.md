---
name: purista-stream-builder
description: Build streaming endpoints and incremental delivery flows with PURISTA streams and protocol-safe framing.
topics: [streams, http, ui]
phases: [architecture, implementation]
---

# PURISTA Stream Builder

## When to use this skill
Use this skill when the user experience requires incremental output, live telemetry, or server-sent updates.

## What this component/package is for
Streams expose long-lived, incremental responses without forcing the whole workflow into one final payload.

## Hard rules
- Keep stream contracts explicit and stable.
- Emit meaningful partial updates; do not spam noise.
- Separate stream transport from durable execution semantics.
- Preserve final state outside the stream if recovery matters.

## Decision rules
- Use a stream when the user benefits from progress or partial content.
- Pair streams with queues and run-state if the work must survive disconnects.

## Recommended file/folder structure
```text
src/service/<service-name>/v1/stream/<stream-name>/
  <streamName>StreamBuilder.ts
  schema.ts
```

## Common implementation patterns
- Stream deltas, reasoning, artifacts, and completion markers explicitly.
- Use HTTP/SSE exposure as a transport layer over the same stream contract.
- For AI flows, map protocol frames cleanly to frontend parts.

## Common mistakes / anti-patterns
- Treating streaming as durability.
- Sending huge repeated snapshots instead of meaningful deltas.
- Mixing stream state and workflow state.

## How this connects to other PURISTA concepts
Streams connect to HTTP runtime, agent protocol, frontend consumption, and queue-backed durable work.

## Read if needed
- `specs/10-streaming/00-requirements.md`
- `specs/10-streaming/50-http-sse-exposure.md`
- `website/doc/handbook/2_building_business-logic/agent/frontend.md`
