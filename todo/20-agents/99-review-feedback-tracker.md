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

## Next spec update pass (planned)
- [ ] Update `website/doc/handbook/2_building_business-logic/agent/protocol-and-streaming.md`
- [ ] Update `website/doc/handbook/2_building_business-logic/agent/model-providers-and-openai.md`
- [ ] Update `website/doc/handbook/2_building_business-logic/agent/agent-builder.md`
- [ ] Update `todo/20-agents/*` sections to match final runtime API naming and telemetry contract

## Notes for upcoming implementation phase
- Keep backward compatibility out of scope unless explicitly requested.
- Validate with:
  - lint
  - unit tests
  - build
  - example compile/run flow
- Ensure docs/examples/tests are updated in one aligned pass.
