---
name: purista-http-runtime
description: Teach untrained models how builder-defined commands, streams, and agents are exposed over HTTP while preserving PURISTA service and queue boundaries.
topics: [http-runtime, api, streaming]
phases: [architecture, implementation]
---

# PURISTA HTTP Runtime

## When to use this skill
Use this skill when the user asks for REST, SSE, public APIs, or web-facing delivery on top of PURISTA services or agents.

## What this component/package is for
HTTP runtime exposes service and agent capabilities without changing the underlying command, stream, or queue model.

## Core PURISTA concept
HTTP is a transport wrapper over builder-defined services and streams. Commands, queues, agents, and streams stay the source of truth; HTTP only exposes them.

## Builder lifecycle
1. Define commands, streams, or agents first.
2. Attach HTTP exposure metadata on the relevant command or stream builder when needed.
3. Assemble the owning service definition.
4. Instantiate the service.
5. Run the HTTP server that reflects those definitions.

## Hard rules
- Keep HTTP exposure as a transport layer.
- Preserve the internal distinction between inline and durable execution.
- Use streaming transports explicitly for incremental output.
- Do not collapse queue-backed workflows into fake synchronous endpoints.

## Decision rules
- Expose commands directly when the API is request/response.
- Expose attach-and-stream or SSE when long-running work needs live progress.
- Keep HTTP handlers thin and delegate real work to services or agents.

## Definition pattern
- Use command and stream builders as the source of HTTP-exposed capabilities.
- Keep HTTP server services separate from business service definitions.

## Implementation pattern
- Expose commands with endpoint metadata on the command builder.
- Expose streams with stream endpoint metadata on the stream builder.
- Keep transport-specific concerns in the HTTP runtime package, not in business handlers.

## Configuration pattern
- Route, auth, CORS, and server configuration are runtime concerns.
- Business contract shape remains defined by the underlying service or stream builder schemas.

## Instantiation / runtime wiring
- The business service instance must exist before HTTP runtime can expose it.
- HTTP server services and bridges need runtime wiring in addition to the business service instances they expose.
- Queue-backed or agent-backed paths still require their normal runtime resources and bridges.

## Verification cues
- The same command or stream remains usable without HTTP because the builder definition is primary.
- The API shape can be traced back to command or stream schemas.
- Durable workflows still show queue or agent runtime wiring rather than pretending the HTTP layer owns them.

## Common mistakes / anti-patterns
- Treating the HTTP route tree as the architecture.
- Mixing transport response shaping into core business logic.
- Hiding durable queue behavior behind a synchronous-looking endpoint.
- Explaining HTTP exposure without the underlying builder-defined command, stream, or agent.

## How this connects to other PURISTA concepts
HTTP runtime builds on service builders, command and stream builders, queue-backed workflows, agents, and transport-specific server packages.

## Read if needed
- `packages/httpserver/src/service/httpServer/v1/httpServerV1ServiceBuilder.ts`
- `packages/hono-http-server/src/service/hono/v1/honoV1ServiceBuilder.ts`
- `examples/ai-basic/src/service/support/v1/stream/runSupportAgentStream/runSupportAgentStreamBuilder.ts`
- `specs/10-streaming/50-http-sse-exposure.md`
- `website/doc/handbook/2_building_business-logic/agent/frontend.md`
