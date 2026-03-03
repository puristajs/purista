# Implementation Plan (Draft)

## Phase 0: RFC and design locking

- Finalize streaming primitives and lifecycle contracts.
- Finalize the public interface additions without breaking `EventBridge`.
- Finalize builder APIs and type parameter shapes (match existing builder patterns).
- Finalize agent core contracts and error taxonomy.
- Define capability matrix for each event bridge.

Deliverables:

- Approved RFC docs.
- Type-level contract prototypes.
- Decision on stream frame transport mapping (new `EBMessageType` vs `CustomMessage` encoding).

## Phase 1: Streaming foundation

- Implement stream session primitives in core.
- Add stream routing and ownership model.
- Add client stream API (async iterator).
- Add tracing and metrics for stream lifecycle.
- Add a stream definition builder and service builder integration (additive).

Deliverables:

- Core streaming API.
- Stream definition types are included in service definitions export format.
- Integration tests for at least one bridge.

## Phase 2: Bridge support rollout

- Implement support per bridge incrementally.
- Add capability flags and fallback behavior.
- Add scale/concurrency tests.
- Define per-bridge routing keys and isolation rules (documented and tested).

Deliverables:

- Capability matrix docs.
- Bridge-level test coverage.

## Phase 2b: Async queue rollout

- Land QueueDefinition/QueueWorker builders, lifecycle defaults, and context additions (`.canEnqueue`, `context.queue.*`).
- Ship `DefaultQueueBridge` plus Redis queue bridge (lists/BLPOP) with full integration tests; document supported providers (Redis, JetStream, SQS, Azure queues).
- Update CLI/templates/examples to scaffold queue flows and HTTP async `202 Accepted` endpoints.
- Extend test helpers + health telemetry to cover queue metrics, DLQ depth, and job lifecycle spans.

Deliverables:

- Queue spec docs + implementation plan (`todo/15-async-queues/*`, `async-queues-implementation-plan.md`).
- Core queue runtime + default bridge merged behind feature flag (if necessary).
- CLI/tests/docs updated to demonstrate command → queue → worker flow.

## Phase 3: Agent core runtime

- Create `@purista/ai` orchestration package.
- Implement provider adapter contract.
- Add token/cost metrics and tracing.
- Define agent lifecycle event stream types (for streaming and observability).

Deliverables:

- First working agent runtime with one provider.
- Unit and integration tests.

## Phase 4: Tools, MCP, memory

- Add tool registry and validated invocation.
- Add MCP adapter integration.
- Add memory adapters and policies.
- Provide a typed policy hook surface (redaction, allowlists, auditing).

Deliverables:

- Example agent service using tools and memory.
- Error handling and policy documentation.

## Phase 5: Hardening and DX

- Improve generated typing and IDE hints.
- Add migration guides and examples.
- Perform load and failure-mode testing.
- Extend `ClientBuilder` generation to output streaming clients (and agent run helpers).

Deliverables:

- Production-readiness checklist.
- Adoption handbook and cookbook examples.

## Immediate next steps

1. Create RFC templates for streaming and agents.
2. Build an event-bridge capability matrix document.
3. Prototype queue builder types + lifecycle defaults (`QueueDefinitionBuilder`, `QueueWorkerBuilder`) and wire `.canEnqueue` contexts.
4. Prototype minimal stream session API in `@purista/core` (no bridge integration yet).
5. Prototype `@purista/ai` interfaces with strict typings and no provider implementation.
6. Prototype builder shape in TypeScript only (no runtime), validate type inference ergonomics.
