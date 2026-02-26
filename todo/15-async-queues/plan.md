# Async Queue Expansion – Implementation Plan

## Snapshot

- **Objective**: extend Purista with pull-based async queues (definitions, workers, bridges, DX) while preserving existing command/subscription behavior.
- **Drivers**: CQRS support, pull-based AI agent pools, parity with streaming spec, OpenTelemetry-first observability.
- **Approach**: iterate in clearly scoped workstreams so changes land incrementally but keep end-to-end viability (spec → core → bridges → DX → docs/tests).

## Workstreams

### 1. Finalize specs and backlog
- [x] Update `specs/15-async-queues/*` to reflect clarified requirements: optional/configurable lifecycle state machine defaults, HTTP 202 contract, `canEnqueue` guardrails, DLQ naming defaults per bridge, no push-based providers.
- [x] Reference queue use-cases in `specs/00-context.md` + `specs/README.md` for discoverability.
- [x] Capture CLI stories (`purista add queue`, `purista add queue-worker`) with concrete prompts, files, and defaults.
- [x] Document minimum bridge capabilities (pull, leases, ack) and explicitly list supported provider targets (e.g., in-memory, Redis core lists, JetStream, SQS).

### 2. Core framework changes
- [x] Introduce queue types, builders, and lifecycle logic inside `packages/core` (QueueDefinition, QueueWorker, QueueBridge interfaces, error hierarchy).
- [x] Extend ServiceBuilder + runtime to register queues/workers, hydrate contexts with `.queue.enqueue` / `.queue.scheduleAt`, and surface queue health.
- [x] Implement `DefaultQueueBridge` (in-memory) with configurable lease defaults + DLQ storage, plus telemetry instrumentation.
- [x] Wire OpenTelemetry spans/metrics + Purista guard hooks for queue handlers; ensure security rules mirror commands (auth, scopes, `.canEnqueue`).

### 3. Provider bridges
- [ ] Add packages for each viable provider (start with `packages/redis-queue-bridge` leveraging lists/BLPOP or core queue semantics, not Redis Streams; expand to NATS JetStream, AWS SQS/FIFO, others only if pull + lease semantics exist).
- [ ] Each bridge must expose configurable dead-letter destinations + sensible defaults, optional tracing metadata, and documentation of unsupported features instead of emulation.
- [ ] Provide contract tests shared across providers to ensure consistent behavior (enqueue → lease → retry → DLQ).

### 4. DevEx & CLI
- [ ] Update CLI (`packages/cli`) with `purista add queue` + `purista add queue-worker` flows, scaffolding queue definitions, optional producer command, worker skeleton, and service wiring.
- [ ] Extend project template (`packages/create-purista` + `starter` example) to include sample queue + worker + HTTP async endpoint returning `202 Accepted`.
- [ ] Enhance test helpers/mocks to stub queues, plus new integration test harness entries for queue-heavy services.

### 5. Documentation & examples
- [ ] Add handbook sections describing when to use queues vs commands/subscriptions/streams, HTTP async response contract, lifecycle defaults, and security story.
- [ ] Provide example service demonstrating enqueue from command/subscription and worker consumption, plus instructions for running with in-memory + Redis bridge.
- [ ] Update CHANGELOG + migration guides with new APIs (`canEnqueue`, context additions).

### 6. Testing & rollout
- [ ] Unit: builders, context typing, lifecycle config validation, DefaultQueueBridge behavior.
- [ ] Integration: service-level flow using in-memory bridge; provider-specific suites (Redis, JetStream, SQS) using docker-compose like other bridges.
- [ ] End-to-end docs/test: CLI scaffolding snapshot tests, HTTP 202 contract tests, telemetry assertions.
- [ ] Define rollout checklist (feature flag?), plus follow-up tasks for future enhancements (status endpoints, scheduling, queue introspection command).

## Dependencies & sequencing

1. Specs/backlog must land before large-scale coding (Workstream 1).
2. Core framework work (Workstream 2) unblocks provider bridges + CLI/test helpers.
3. Provider bridges can progress in parallel once interfaces stabilize.
4. Docs/examples/testing (Workstreams 4–6) happen continuously but wrap after code merges to reflect final API.

## Open questions / assumptions

- Dead-letter *events* remain optional; telemetry is the default observability surface. Bridges expose config knobs for teams needing event emission.
- Only providers satisfying pull + lease + ack semantics will receive QueueBridge packages; no emulation for push-only brokers.
- Redis target uses list/BLPOP or similar primitives suited for pull-based queues (not Redis Streams) to align with user expectations.
- Default lifecycle config ships with conservative values (visibility 15m, heartbeat 5m, exponential retry) but builder override is available per queue/worker.
