# Platform Architecture for `@purista/ai`

## 1. Package layout

`@purista/ai` now ships as a **single package** (`packages/ai`) that mirrors the folder conventions of `@purista/core`. Everything — builders, runtime helpers, protocol schemas, MCP adapters, evaluation helpers — lives under one roof so projects only install one dependency while each concern remains isolated through subfolders/exports:

```
packages/ai/
 └─ src/
     ├─ builder/                 // AgentBuilder + helper DSLs
     ├─ runtime/                 // AgentInstance, AgentExecutor, invokeAgent helper
     ├─ protocol/                // protocol schemas + bridge helpers (framework agnostic)
     ├─ pools/                   // PoolManager + metrics hooks
     ├─ memory/                  // session-store interfaces + in-memory default
     ├─ knowledge/               // knowledge adapters (in-memory baseline)
     ├─ providers/               // ModelProvider interface + registries built on ai-sdk
     ├─ manifest/                // managed-config publisher helpers
     ├─ platform/services/       // reference orchestrator + worker services built with PURISTA
     ├─ mcp/                     // optional MCP bridge helpers
     ├─ evaluation/              // JSON result helpers for Vitest/Jest suites
     └─ index.ts                 // curated exports so non-AI apps import nothing by default
```

Because everything sits in `packages/ai`, TypeDoc/website wiring, linting, and release automation only need to track one package. The CLI scaffolder and optional orchestrator services import from the same entry point, so AI remains opt-in while code reuse stays high.

## 2. Agent runtime model

1. **Build-time** – `AgentBuilder.create(...)` describes metadata (name, version, schemas, allowed tools, persistence, HTTP exposure) and returns a definition with `.getInstance`. The builder is a first-class API rather than a thin wrapper over `ServiceBuilder`, so agents feel native but remain isolated from service DSLs.
2. **Start-up** – `agentDefinition.getInstance({...}).start()` registers the agent runtime on the EventBridge using the same injection model as services (`eventBridge`, `secretStore`, `sessionStore`, `configStore`, `resources`, `logger`, OTEL span processor, etc.). Concurrency pools and telemetry are wired automatically.
3. **Invocation** – Any PURISTA command/queue/stream (or HTTP bridge) calls `invokeAgent({ agentName, agentVersion?, payload, parameter })`. The helper publishes a PURISTA command targeted at the agent channel, so tracing, retries, and logging behave exactly like other invocations without exposing protocol implementation details.
4. **Streaming-first** – Agents always emit protocol frames. Callers that need a blocking response wait until a `message.final` frame is received; HTTP/SSE/WebSocket transports forward frames as they arrive so UI clients get identical envelopes whether the workflow runs inline or on a queue.

Agents therefore live beside services with their own lifecycle, config manifests, OpenAPI documentation, and telemetry while still piggy-backing on the shared EventBridge transport. The `providers` folder wires the [Vercel AI SDK](https://ai-sdk.dev/) so that adapters automatically inherit its rich provider catalogue, streaming protocol, and telemetry hooks while remaining swappable through managed config.

## 3. HTTP/UI exposure

- The builder exposes `.exposeAsHttpEndpoint`, `.addQueryParameters`, `.makeEndpointPublic`, and `.setStreamingMode('sse' | 'chunked' | 'buffered')`, mirroring the existing command builder API and generating OpenAPI definitions automatically.
- Default streaming mode is SSE. When buffering is chosen the HTTP bridge waits for the final protocol frame before responding, so synchronous APIs still carry structured telemetry/errors.
- Frontends, partner systems, or CLI clients simply interpret protocol frames; they never need internal PURISTA message metadata because helper utilities wrap it for them, and bridge helpers can re-emit the frames as Vercel AI SDK streams whenever a UI already expects that format.

## 4. Concurrency & queues

- Each agent definition can call `.setConcurrency({ maxWorkers, poolId? })`. The runtime enforces the limit with a `PoolManager` (in-memory by default) while allowing teams to plug in Redis/Postgres backed pools later.
- Background workloads reuse the async queue spec: `.queueAgentRun` helper packages the agent payload/parameter into an existing queue, and queue workers call `invokeAgent` once they acquire a pool slot. No bespoke queue implementation ships with the AI package.
- Scaling remains the responsibility of the hosting platform (Kubernetes, Nomad, serverless). Pools simply bound concurrency and expose OTEL metrics so Grafana/Prometheus alerts can track saturation. Cost calculation stays outside the framework; the runtime only emits the numbers required to build dashboards.

## 5. Tools & adapters

- Tools are explicit allowlists referencing existing commands (`{ serviceName, serviceVersion, commandName }`). Runtime helpers resolve them using the same permission model as `.canInvoke`, and attempts to call non-allowlisted tools raise `HandledError` + protocol error frames.
- Model providers, session stores, knowledge adapters, session/history helpers, and MCP bridges remain pluggable via the builder/config pattern used everywhere else in PURISTA. Defaults (echo provider, in-memory session store, in-memory knowledge, in-memory pool manager) keep examples runnable without infrastructure, while production adapters can be swapped in via managed config without modifying agent source files.
