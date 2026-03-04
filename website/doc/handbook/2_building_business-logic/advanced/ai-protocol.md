---
title: AI Protocol
description: Envelope and frame contract used by @purista/ai for streaming, telemetry, and tool traces.
order: 299904
---

# AI Protocol

PURISTA AI uses a structured protocol on top of regular PURISTA messages/streams so UIs and external systems can understand complex agent flows consistently.

## Why this protocol exists

The protocol is designed to:

- keep agents as black boxes (no external caller forcing internal tool choices)
- capture nested flows (agent-to-agent, tool chains, retries) in a UI-friendly format
- be transformable to other ecosystems (for example AI SDK stream events, MCP, agent-to-agent connectors)
- preserve PURISTA transport semantics (correlation IDs, trace IDs, tenant/principal propagation)

## Envelope shape (conceptual)

Each emitted item is an **envelope**:

- `version` protocol version
- `messageId` unique id for this envelope
- `conversationId` conversation/thread identifier
- `inReplyTo` previous message id when this envelope is a response
- `timestamp` ISO timestamp
- `actor` sender identity (`service`, `version`, optional `agent`, `instanceId`)
- `userId` / `tenantId` for isolation-aware consumers
- `frame` one of the frame kinds listed below

## Frame kinds

- `message`: text content, supports partial chunks and final message
- `tool`: tool invocation lifecycle (`invoked`, `success`, `error`) with input/output
- `telemetry`: duration, wait time, provider, token usage metrics
- `artifact`: non-text outputs (JSON artifacts, files, structured payloads)
- `error`: handled/unhandled error information in normalized form

## Identity and correlation

The protocol intentionally reuses PURISTA identity metadata:

- `traceId` and correlation chain come from PURISTA message transport
- actor identity comes from service + version + instance
- `inReplyTo` links follow-up frames and nested invocations

This gives reliable traceability across services, agents, tools, and frontend timelines.

## Error semantics

- `HandledError` becomes an `error` frame with handled semantics.
- Unexpected exceptions become unhandled `error` frames.
- The stream still stays structurally valid for consumers.

## Token usage and telemetry

Token usage and latency are emitted as telemetry frames and included in final response metadata.  
This allows external observability stacks (Grafana/OTel backends) to alert without embedding budgeting logic into the framework.

## How developers should use it

Most developers should not create protocol objects manually.

Use:

- `context.stream.sendChunk/sendFinal/sendArtifact/sendError` in handlers
- `context.tools.invoke(...)` for allowlisted command/agent tools
- helpers like `toAiSdkStreamEvents(...)` when exposing streams to UI clients

Manual envelope creation is only for advanced adapters/integrations.
