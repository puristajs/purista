---
name: purista-http-runtime
description: Expose PURISTA commands, streams, and agents over HTTP without collapsing the internal service and queue model.
topics: [http-runtime, api, streaming]
phases: [architecture, implementation]
---

# PURISTA HTTP Runtime

## When to use this skill
Use this skill when the user asks for REST, SSE, public APIs, or web-facing delivery on top of PURISTA services or agents.

## What this component/package is for
HTTP runtime exposes service and agent capabilities without changing the underlying command, stream, or queue model.

## Hard rules
- Keep HTTP exposure as a transport layer.
- Preserve the internal distinction between inline and durable execution.
- Use streaming transports explicitly for incremental output.

## Decision rules
- Expose commands directly when the API is request/response.
- Expose attach-and-stream or SSE when long-running work needs live progress.
- Keep HTTP handlers thin and delegate real work to services or agents.

## Recommended file/folder structure
```text
src/config/http.ts
src/index.ts
src/service/
src/agents/
```

## Common implementation patterns
- Register services and agent services into the HTTP server after they start.
- Serve static frontend assets separately from API routes.
- Use API docs generation from schemas and service definitions.

## Common mistakes / anti-patterns
- Re-implementing business logic in route handlers.
- Using HTTP request lifetime as the only durability model.
- Ignoring streaming for long-running user-facing flows.

## How this connects to other PURISTA concepts
HTTP runtime depends on commands, streams, queues, agents, protocol framing, and observability.

## Read if needed
- `specs/10-streaming/50-http-sse-exposure.md`
- `specs/28-voyage-interfaces/20-rest-api-spec.md`
- `specs/28-voyage-interfaces/30-stream-protocol-spec.md`
