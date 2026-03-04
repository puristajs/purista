# AI Agent Orchestration Requirements

PURISTA already provides commands, queues, streams, managed config, and strict schema validation. The AI extension must reuse those proven primitives instead of inventing standalone infrastructure. The requirements below describe the baseline that every implementation, package, and example has to fulfil.

## 1. Core Capabilities
- **Agent lifecycle** – Developers can add an agent next to a service via the CLI, describe it with a builder, obtain an instance via `.getInstance()`, publish the manifest to managed config, and execute it either synchronously through `invokeAgent` (commands/streams) or asynchronously via queue workers.
- **Inter-agent collaboration** – Multiple agents communicate through the protocol defined in `specs/agent_protocol_concept`. The protocol payload travels inside standard PURISTA messages (`payload` or stream frames) so existing bridges and security controls keep working.
- **Tool reuse** – Commands become tools without re-describing schemas. Developers explicitly allowlist commands via `.allowTool` (mirrors `.canInvoke`) so not every command is exposed. The helper code auto-converts command metadata into tool descriptors.
- **Provider abstraction** – LLM providers are treated like resources (similar to secrets/config). `@purista/ai` ships an interface plus adapters (Echo/dev-only) and builds on the [Vercel AI SDK](https://ai-sdk.dev/) so teams can wire any supported provider (OpenAI, Anthropic, AWS Bedrock, Ollama, etc.) without touching agent code while inheriting consistent streaming, telemetry, and safety primitives.
- **Asynchronous workloads** – Background runs use the queue feature delivered in `specs/15-async-queues`, but the AI spec only describes how manifests, pools, and workers sit on top of it. No new queuing tech is required.
- **Streaming parity** – Agents emit protocol frames as PURISTA streams or HTTP chunked responses using existing streaming work. Background jobs publish the same frames once a worker finishes so UIs experience identical envelopes.
- **Optional MCP bridge** – Helpers exist to expose agents/commands as MCP tools without forcing MCP on every project. The bridge stays in a separate module so frontend/third-party consumers can opt in, and shares the same protocol helpers so MCP or Agent-to-Agent conversions are straightforward.

## 2. State & Knowledge
- **Session storage** – Every agent can persist its own scratchpad/history. The default adapter is in-memory so examples work without infrastructure, but adapters are pluggable (Redis, Postgres, vector DB). Interfaces mirror the existing session-store contracts.
- **Shared knowledge** – Agents can reference shared knowledge bases (documents, embeddings) through adapters. Shared artifacts live behind configurable names (e.g., `default`, `roadmap`, `tickets`).
- **Conversation history helpers** – Helpers exist for trimming, summarising, and loading histories so developers do not hand-roll transcripts.
- **Protocol-first responses** – Helper utilities wrap command/subscription output into protocol envelopes, including `inReplyTo`, message IDs, token usage, and handled/unhandled errors. Templates must use these helpers so developers never manipulate envelope fields manually, and adapters exist to convert envelopes into AI SDK streams or other protocols when exposing results to UIs.

## 3. Operations & Observability
- **OpenTelemetry integration** – Agent runs, tool calls, and queue executions produce spans with the same naming conventions as the rest of PURISTA. No special exporter required.
- **Concurrency guards** – Pools limit how many agent runs execute simultaneously to avoid rate-limit explosions. Pools expose metrics so external systems (Grafana, Prometheus) can alert, but PURISTA itself does not attempt cost prediction or budgeting.
- **Error handling** – The AI packages reuse `HandledError`/`UnhandledError`. Errors automatically become protocol error frames and still bubble through the EventBridge semantics.
- **Logging & metrics** – Logging sticks to `context.logger`. Token usage, timings, and prompt metadata are collected so downstream monitoring (Grafana, OTEL metrics) can display them.

## 4. Developer Experience & DX boundaries
- **Builders everywhere** – Agent manifests, pool configs, and adapters all use builder/config patterns identical to the existing `ServiceBuilder`. No hard-coded references to schema libraries: PURISTA’s `extendApi` + `Schema` abstractions remain the API.
- **CLI integration** – `purista add agent` must always scaffold both the agent builder and a runnable `*.test.ts` beside it. The generated test must already boot an in-memory EventBridge, inject a deterministic model provider, execute one agent run, and assert protocol output. No separate `purista ai build/deploy` binaries exist.
- **Testing/evaluation** – Agents are unit-testable (Vitest scaffolds run by default). Evaluation helpers describe structure, expected JSON output, and metrics (accuracy %, duration min/max/avg, token counts). Dataset formats remain user-defined; only the evaluation result schema is standardized.
- **Documentation** – Specs must call out that every shipped package requires README/handbook/TypeDoc coverage, plus integration in the existing lint/test/build pipelines. `examples/ai-basic` is the canonical comprehensive reference and must keep: (1) command -> agent invocation, (2) agent-to-agent call, (3) tool invocation, (4) event subscription -> agent invocation, (5) HTTP/SSE frontend consumer, and (6) runnable tests for agents and command integration.

## 5. Non-Goals
- No app-specific behavior or cross-application hacks inside the AI package. Any client can consume the protocol as a regular PURISTA payload.
- No bespoke cost calculators or budgeting rules. We simply expose metrics so external tooling can observe usage.
- No changes to PURISTA core message shapes beyond using the protocol as the payload. All AI concerns live in opt-in packages (`@purista/ai`, future adapters) so non-AI apps remain untouched.
