# Async Queue Implementation Plan

Status: Draft (created February 25, 2026)  
Owner: Codex async queue workstream  
Scope: implement pull-based queue primitives, default bridge, DX, and docs/tests for Purista vNext.

## Key requirements

- **Pull-first queues**: command/subscription handlers enqueue work into queues through a `.canEnqueue` guard + transform hook before payloads leave the service. Workers poll queues (continuous, fixed interval, or "next after success") and acknowledge leases to avoid stuck/duplicated work.
- **Lifecycle state machine**: each queue definition exposes configurable lifecycle states (Pending → InFlight → Completed → Failed → DLQ) with robust defaults (visibility timeout 15m, exponential retry, jitter). Builders must allow overriding these values or opting into a simplified lifecycle.
- **Safety + observability**: QueueBridge contracts enforce ack/lease semantics so no message is lost if workers crash. Dead-letter destinations have sane, provider-specific default names but remain configurable per queue. OpenTelemetry spans/metrics are the primary observability surface; DLQ events are optional.
- **Security parity**: Queue enqueuers/consumers inherit the same auth/z patterns as commands (scopes, tenants, service identity) and reuse guard hooks so existing policy code remains valid.
- **HTTP async contract**: HTTP commands exposing async work must return `202 Accepted` plus a job reference document (`{ queueId, jobId, statusEndpoint }`). Follow-up polling endpoints should map to `200`, `202`, `303`, `410`, `500` responses per RFC 7231 guidance.
- **Provider expectations**: only build QueueBridge packages for backends with true pull + lease semantics (e.g., in-memory default, Redis core lists/BLPOP, NATS JetStream consumers, AWS SQS). Do not attempt to emulate features (delay, leases) on push-only providers such as RabbitMQ.
- **CLI & templates**: `purista add queue` scaffolds queue definition + worker + optional producer command (opt-out available). Templates/start projects must include at least one queue + worker + HTTP async endpoint showcasing the full flow.
- **Testing support**: mocks/test helpers expose queue-aware contexts, `.queue.enqueue()`, `.queue.scheduleAt()`, and utilities to assert enqueued payloads. Integration suites cover enqueue → worker → DLQ and provider-specific bridges.

## Milestone 1 – Core foundations (`packages/core`)

**Goals**
- Introduce queue types (message envelope, lifecycle states, lease/retry config, metrics) under `packages/core/src/core/types/queue`.
- Add `QueueBridge` base interfaces + helpers (enqueue, lease, ack, abandon, moveToDlq) with schema validation.
- Extend `ServiceBuilder`, queue/worker builders, and context mocks with `.canEnqueue` + queue transforms, mirroring existing command/subscription DSL style.

**Tasks**
1. Create queue type modules with schema-first TS definitions + unit tests (message envelope, lifecycle config, worker options).
2. Implement `QueueDefinitionBuilder` / `QueueWorkerBuilder` DSLs mirroring command patterns (builders, guard hooks, lifecycle overrides, preprocessors before enqueue).
3. Add `.canEnqueue` to command/subscription/stream builders and integrate typed `context.queue.*` helpers and test mocks (including `.queue.enqueue`, `.queue.scheduleAt`).
4. Define lifecycle default constants + schema validation ensuring overrides remain optional yet type-safe.
5. Update type exports (`packages/core/src/index.ts`, etc.) and ensure tree-shaking safe structure.

**Exit criteria**
- TypeScript builds compile.
- New builders have baseline tests (type-level + runtime) verifying schema inference, guardrails, and lifecycle overrides.
- Test helpers/mocks support queue contexts.

## Milestone 2 – Runtime wiring

**Goals**
- Teach `ServiceBuilder`/`Service` runtime to register queues/workers and hydrate contexts.
- Inject QueueBridge resource (defaulting to in-memory) and worker loops with lifecycle management plus configurable poll cadence (interval or "repeat after completion").
- Guarantee that long-running workers renew leases/visibility while still preventing stuck messages; unacked work must transition back to Pending or DLQ based on retry budget.

**Tasks**
1. Update `ServiceBuilder.resolveDefinitions` and runtime bootstrap to respect queue/worker lists and surface `.canEnqueue` metadata.
2. Implement queue worker scheduler (continuous/interval/sequential) with lease renewal + telemetry hooks and panic-path cleanup to avoid stuck leases.
3. Extend health/readiness + OpenTelemetry instrumentation for enqueue/dequeue/processing spans, linking job + worker attributes.
4. Update mocks/helpers to include queue behavior for unit/integration tests and expose deterministic timer controls.
5. Provide HTTP async helper to map internal queue lifecycle states to HTTP status codes for adapters.

**Exit criteria**
- `packages/core` integration tests cover enqueue → worker → ack flow using a stub bridge.
- Health endpoint surfaces queue metrics + DLQ depth warnings.
- HTTP adapter tests prove `202 Accepted` contract works end-to-end.

## Milestone 3 – Default QueueBridge

**Goals**
- Ship `DefaultQueueBridge` (in-memory) for local dev/tests with deterministic lease/visibility behavior.
- Provide shared helpers for provider bridges (lease tokens, retry/backoff) plus configurable dead-letter naming per queue.

**Tasks**
1. Implement in-memory bridge storing queues + DLQs, supporting delay, heartbeats, and metrics, plus configurable DLQ id pattern (default `<queueId>.dlq`).
2. Add test harness utilities to control time/leases and simulate crash/recovery flows.
3. Document non-production scope and config knobs, including lifecycle defaults + overrides.

**Exit criteria**
- Vitest suite for bridge behavior (enqueue, pre-process hooks, delay, retry, DLQ, stuck job recovery).
- Service-level integration test uses default bridge end-to-end, covering HTTP async command returning `202`.

## Milestone 4 – Provider bridges

**Goals**
- Add real QueueBridge packages for providers that satisfy pull + lease semantics (Redis core lists/BLPOP, NATS JetStream consumers, AWS SQS/SQS FIFO, Azure Storage Queues).

**Tasks**
1. Scaffold `packages/<provider>-queue-bridge` directories mirroring existing EventBridge modules (but not reusing EventBridge push semantics).
2. Share connection/client setup with existing provider packages where possible (without mixing abstractions).
3. Implement capability detection + configuration, DLQ naming (provider defaults + overrides), metrics, and explicit validation when a mandatory capability (pull, delay, lease) is missing—no emulation.
4. Add docker-based integration tests (Redis core BLPOP/NATS JetStream) similar to current event bridge suites.
5. Document unsupported providers (e.g., RabbitMQ exchanges) and rationale so integrators understand limitations.

**Exit criteria**
- At least one provider bridge (Redis core lists) passes integration tests.
- Documentation lists supported providers + minimum guarantees + required configuration knobs (DLQ names, retry budget).

## Milestone 5 – DevEx (CLI/templates/docs)

**Goals**
- Update CLI (`packages/cli`) with `purista add queue` / `purista add queue-worker`.
- Extend `packages/create-purista`, `examples`, and docs with queue scaffolds + HTTP async contract guidance.

**Tasks**
1. Implement CLI prompts + generators (queue definition, worker skeleton, optional producer command with `.canEnqueue`; default to "yes" because most queues need a producer).
2. Update templates/examples to showcase HTTP `202 Accepted` async endpoint returning `{ jobId, queueId, statusUrl }` and a worker that polls sequentially.
3. Refresh docs (handbook, CHANGELOG, migration guide) describing queue usage, security parity, HTTP contract, and provider selection.
4. Update test helpers + documentation for new context methods (`getQueueContextMock`, CLI snapshots).
5. Provide CLI storyboards for `purista add queue` questions (queue id, worker options, poll cadence, whether to scaffold producer command, queue bridge selection).

**Exit criteria**
- CLI snapshot/unit tests updated, covering both queue + worker scaffolding flows.
- Docs published; CHANGELOG entries added and starter template contains a queue + worker sample.

## Milestone 6 – Rollout/testing

**Goals**
- Ensure coverage via unit, integration, e2e tests; finalize telemetry + health stories; define release checklist.

**Tasks**
1. Expand Vitest configs (unit/integration) to include queue suites and provider bridge docker tests.
2. Add example service/integration tests demonstrating command → queue → worker path with HTTP `202` endpoint plus DLQ handling.
3. Document rollout steps (feature flag, config toggles) and future enhancements backlog (e.g., queue introspection command, multi-tenant throttling).
4. Ensure starter/test helpers expose queue-aware assertions for `.canEnqueue`.

**Exit criteria**
- CI passes including new queue suites + provider docker tests.
- Release checklist + migration notes ready (including steps to enable CLI support and queue bridges).

---

## Architecture refinement plan (February 2026)

Even though the initial implementation already injects `queueBridge` alongside `eventBridge`, we want to streamline the architecture before release so queue transports mirror event bridge abstractions exactly and no residual coupling remains. The refactor spans the following steps:

1. **Spec alignment**
   - Update `specs/15-async-queues` docs to spell out the final separation rules (event bridges never reference queues, queue bridges follow event bridge naming/typing conventions, default queue bridge in core, provider packages optional).
   - Document lifecycle state machine defaults (including optional DLQ state config) and HTTP async response mapping again so builders/tests have a single source of truth.

2. **Core service/runtime cleanup**
   - Ensure QueueBridge types live under `core/EventBridge`-style namespaces (`QueueBridge`, `QueueBridgeConfig`, `QueueBridgeCapabilities`, typed handler contracts).
   - Remove any leftover queue logic from event bridge modules (helpers, span tags, tests) so each abstraction is isolated.
   - Service runtime should instantiate queue bridges only when queues/workers exist, surface health independently, and provide `context.queue` even when event bridge is swapped.
   - Introduce explicit guard builder parity: `.canEnqueue` mirrors `.canInvoke` API/telemetry, `.canSchedule` uses same builder style as event bridge invokes.

3. **Default + provider bridges**
   - Keep `DefaultQueueBridge` under `packages/core` as the canonical in-memory implementation, matching DefaultEventBridge code structure.
   - Extract/confirm Redis queue bridge resides in its own package (`packages/redis-queue-bridge`) with zero dependencies on event bridge modules.
   - Audit other provider packages to ensure they only export event bridge adapters; if any queue-specific helpers leaked there, move them beside the queue bridge.

4. **Builder/CLI/test helpers**
   - Update builders so queue definitions/workers register under the new abstraction, adjust context mocks, and ensure `.canEnqueue` hooking replicates event invoke guard ergonomics.
   - Extend CLI scaffolding + test helpers to wire queue bridges through the new flow (embedding code samples that show independent `queueBridge` injection).
   - Refresh Vitest suites + integration tests to cover the decoupled wiring (service creation with only event bridge, only queue bridge, both, plus Redis bridge contract tests).

5. **Documentation + communication**
   - Rewrite handbook sections (Queues, Service, Event Bridges, Quickstart, Advanced) to highlight “mix and match” deployments and the default queue bridge story.
   - Update CHANGELOG + migration notes to mention the architecture shift (no releases yet, but future readers need guidance).

Team agreement: execute these steps sequentially, committing each milestone separately for easier review. Tests/docs must pass after every major chunk.

---

Work should proceed milestone by milestone, keeping PRs focused (core, runtime, bridge, CLI, docs). This file should be updated as milestones complete or scope changes.
