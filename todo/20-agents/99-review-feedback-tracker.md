# AI Agent Spec Review Feedback Tracker

Status legend:
- `[ ]` open
- `[~]` agreed, not yet implemented
- `[x]` implemented

## Session 2026-03-03 - Streaming and telemetry DX

### 1) Public API naming: avoid protocol-internal wording
- [~] Replace protocol-centric API in developer-facing examples/docs:
  - from: `context.protocol.emitMessage(...)`
  - to: action-oriented stream API like:
    - `context.stream.sendChunk(...)`
    - `context.stream.sendFinal(...)`
    - `context.stream.sendError(...)`
- [ ] Keep protocol framing internal to `@purista/ai` helpers/adapters.
- [ ] Ensure naming does not leak internal protocol implementation details.

### 2) Telemetry model: automatic first, manual only for custom metrics
- [~] OpenTelemetry remains the primary tracing mechanism.
- [ ] Agent runtime auto-traces:
  - model invocation span(s)
  - tool invocation span(s)
  - retries/failures
- [ ] Token usage and duration should be auto-collected when provider data exists.
- [ ] Manual telemetry API (if exposed) should be limited to custom business metrics/events.
- [ ] Remove need to manually emit a separate telemetry chunk for common usage stats.

### 3) Final response contract
- [~] Final chunk/final response should automatically contain normalized usage metadata.
- [ ] Define canonical final payload metadata shape in spec:
  - `usage` (prompt/completion/total tokens, when available)
  - duration/timing
  - finish reason
  - model/provider id (if available)
- [ ] Align behavior for both streaming and non-streaming execution paths.

### 4) True streaming behavior in examples
- [~] Update example to show incremental AI output streaming.
- [ ] Avoid buffering full model output and sending as one large chunk.
- [ ] Keep final response chunk for completion + metadata only.

### 5) `getInstance` parity with PURISTA service pattern
- [~] Align agent `getInstance` signature to core service style for consistency.
  - current (agent): `getInstance({ eventBridge, spanProcessor, ... })`
  - target (aligned): `getInstance(eventBridge, { spanProcessor, ... })`
- [ ] Keep OpenTelemetry injection optional via `spanProcessor` exactly like services.
- [ ] Reuse same dependency defaults behavior where applicable:
  - logger defaults
  - store defaults
  - queue bridge defaults
- [ ] Ensure typed docs/examples show the same mental model as `ServiceBuilder.getInstance(...)`.

### 6) Concurrency/pool config belongs to runtime (deploy-time), not builder
- [~] Move `maxWorkers` out of `AgentBuilder` API (`.setConcurrency(...)` should not hardcode deploy scaling).
- [~] Move pool selection out of static definition as default behavior:
  - no pool config -> auto-generated pool id per agent version (safe default)
  - explicit pool id -> set at runtime in `getInstance(...)` options
- [ ] Runtime API shape to support:
  - `poolId?: string` (optional override)
  - `maxWorkers?: number` (runtime/deploy control)
  - optional injected `PoolManager` instance for host-managed pools
- [ ] Managed config store should be the preferred source for environment-specific worker counts.
- [ ] Builder should keep only generic capability declarations, not deployment sizing values.

## Next spec update pass (planned)
- [ ] Update `website/doc/handbook/2_building_business-logic/agent/protocol-and-streaming.md`
- [ ] Update `website/doc/handbook/2_building_business-logic/agent/model-providers-and-openai.md`
- [ ] Update `website/doc/handbook/2_building_business-logic/agent/agent-builder.md`
- [ ] Update `todo/20-agents/*` sections to match final runtime API naming and telemetry contract

## Example scope feedback (to implement after spec updates)
- [ ] Expand `examples/ai-basic` to a full end-to-end showcase with:
  - static HTML frontend with streaming chat (SSE)
  - tool calls through allowed command invocation
  - agent-to-agent invocation flow
  - event subscription that routes into an agent
  - command handler invoking an agent and returning/streaming result
- [ ] Ensure example reflects queue usage options:
  - direct synchronous/streaming agent invocation (no queue required)
  - optional background queue path for controlled concurrency
- [ ] Add explicit docs section: when queue is required vs optional, and scaling guidance.

## Code style and API docs alignment
- [ ] Separate type definitions from implementation files where practical (follow existing PURISTA style).
- [ ] Improve TSDoc coverage for public classes, functions, and exported types used in `@purista/ai`.
- [ ] Add concise examples in TSDoc for key APIs (`AgentBuilder`, runtime invocation, protocol helpers).
- [ ] Ensure typedoc output and IDE hover docs are clear and task-oriented.

## Handbook coverage gaps
- [ ] Add a dedicated, comprehensive "AI Protocol" section in handbook:
  - envelope/frame schema reference
  - required/optional fields
  - final-response metadata contract
  - error semantics and handling rules
  - protocol transformation patterns (Purista <-> AI SDK stream protocol)
- [ ] Add explicit "what `@purista/ai` exposes from AI SDK" section:
  - `AiSdkProvider` wrapper (generate path)
  - `toAiSdkStreamEvents` transformation helper
  - clarify that full AI SDK surface is **not** re-exported by `@purista/ai`
- [ ] Add integration cookbook pages:
  - frontend SSE consumer
  - agent-to-agent orchestration
  - event subscription into agent
  - command invoking agent (sync + stream)

## MCP integration boundary
- [ ] Clarify in spec that MCP support in Vercel AI SDK can be reused as first-class provider/tool plumbing.
- [ ] Keep Purista-side responsibility for:
  - allowlist enforcement (`allowTool`)
  - protocol frame mapping (tool events, telemetry, errors)
  - identity/correlation propagation (service/instance/message ids)
- [ ] Avoid re-implementing generic MCP client/server mechanics already provided by upstream SDK where possible.

## OpenTelemetry via AI SDK (automatic by default)
- [ ] Use Vercel AI SDK telemetry support out of the box for model/tool spans instead of custom span plumbing in handlers.
- [ ] Ensure telemetry is enabled automatically in runtime/provider wiring (no manual user setup in agent handler code).
- [ ] Bridge Purista message correlation/trace context into AI SDK telemetry context so traces remain connected end-to-end.
- [ ] Keep token usage/duration surfaced in final response metadata and protocol frames from provider telemetry outputs.

## Integration testing strategy (non-flaky)
- [ ] Add full-flow integration tests for `@purista/ai` covering:
  - command -> agent invocation
  - HTTP/SSE streaming frames
  - event subscription -> agent path
  - agent -> tool call(s)
  - agent -> agent invocation
- [ ] Introduce deterministic test doubles in `@purista/ai` test utilities:
  - mock model provider (scripted tokens/usage/errors)
  - mock streaming provider for chunk-by-chunk assertions
- [ ] Prefer deterministic provider tests over real network/provider calls in CI.
- [ ] Keep one optional manual smoke test doc for real provider wiring outside CI.

## Notes for upcoming implementation phase
- Keep backward compatibility out of scope unless explicitly requested.
- Validate with:
  - lint
  - unit tests
  - build
  - example compile/run flow
- Ensure docs/examples/tests are updated in one aligned pass.
