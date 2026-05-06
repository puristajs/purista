# Bridge Reliability Hardening

Source of truth: [`specs/35-bridge-reliability/00-requirements.md`](/Users/sebastianwessel/projekte/@purista/specs/35-bridge-reliability/00-requirements.md)

This document tracks the `purista` monorepo implementation status for the bridge reliability hardening slice.

## Implemented in this monorepo

- Added `EventBridgeCapabilities` and shared late-response handling primitives in core.
- Replaced bridge-local pending invocation maps with a shared pending invocation registry where relevant.
- Hardened `DefaultQueueBridge` lease expiry recovery and retry-to-DLQ flow.
- Hardened `RedisQueueBridge` delayed-release, nack/requeue, expired-lease recovery, DLQ redrive, and orphan-processing recovery with atomic scripts.
- Fixed `HttpEventBridge` lifecycle state transitions.
- Changed `AmqpBridge` durable command defaults to manual ack and non-auto-delete queues.
- Added shared in-flight execution drain tracking in core and reused it across bridge implementations.
- Implemented JetStream durable consumers for `NatsBridge` when JetStream is available, while keeping strict fail-fast behavior for brokers without JetStream.
- Added advisory subscription consumer failure handling in core so adapters can honor bounded retry and dead-letter behavior without coupling service definitions to one transport.
- Added strict startup validation for queue bridge config and subscription consumer failure handling in core service registration.
- Added strict startup validation for command delivery requirements and stream support in core service registration.
- Added explicit subscription handler control outcomes (`ack`, `retry`, `deadLetter`) and runtime normalization so adapters no longer rely on exception-only signaling.
- Expanded subscription handler control outcomes to include `drop` and `stop-consumer`, with strict capability validation and adapter runtime handling in NATS (JetStream) and AMQP.
- Added paused-subscription diagnostics and runtime resume APIs (`Service.getPausedSubscriptionConsumerState`, `Service.resumeSubscriptionConsumer`) backed by adapter pause/resume support.
- Added queue operator APIs for DLQ inspection, replay, purge, and lease inspection to the queue bridge contract.
- Added `@purista/nats-queue-bridge` as a JetStream-based queue provider package with contract coverage.
- Removed the unimplemented subscription exhaustion outcomes from the public contract; exhausted subscription messages are dead-lettered.
- Routed thrown queue-worker errors through the same shared retry / DLQ lifecycle path as explicit retry results.
- Added queue poison-message controls in runtime lifecycle config:
  - repeated-failure threshold
  - optional worker auto-pause
  - explicit runtime pause/resume APIs
- Added configurable bridge mocks plus shared subscription reliability contract tests so adapter verification stays capability-driven.
- Removed the legacy `@purista/httpserver` package from the active platform surface in favor of the Hono-based server package.
- Updated handbook pages so support matrices and reliability wording match current runtime behavior.
- Added explicit command and stream capability surfaces to event bridge capabilities, including command transport and stream late-frame handling.
- Replaced `DefaultEventBridge` stream session bookkeeping with a shared `PendingStreamRegistry` to centralize timeout and late-frame handling.
- Added per-kind in-flight diagnostics (`command`, `subscription`, `stream`, `generic`) for better drain observability.
- Added broker failure-path safety tests for retry/DLQ handoff:
  - NATS dead-letter publish failure must not terminate the original JetStream delivery prematurely.
  - AMQP retry/DLQ handoff confirm failure must not acknowledge the original delivery prematurely.
- Formalized core runtime operator APIs on `ServiceClass` for Kubernetes-style operations:
  - `getInFlightDiagnostics()`
  - `getQueueWorkerPauseState()`
  - `pauseQueueWorkers(queueName, reason?)`
  - `resumeQueueWorkers(queueName)`
  - `getPausedSubscriptionConsumerState()`
  - `resumeSubscriptionConsumer(registrationKey)`
- Added shared core operator-state types (`InFlightDiagnostics`, `PausedQueueWorkerState`, `PausedSubscriptionConsumerState`) and exposed them as first-class public API.
- Extended `ServiceHealthState` with structured paused queue worker and paused subscription consumer details and marked paused-state presence as `warn`.

## Test coverage landed

- event bridge timeout and late-response behavior
- HTTP readiness lifecycle
- AMQP safe durable defaults and shutdown rejection
- NATS strict durable rejection
- NATS subscription retry-to-success and retry-to-dead-letter integration coverage
- AMQP subscription retry-to-success and retry-to-dead-letter integration coverage
- MQTT topic helpers and bridge lifecycle behavior
- default queue bridge lease recovery
- Redis queue bridge contract/integration suite, skipped automatically when Docker is unavailable
- shared queue worker runtime coverage for thrown handler errors and strict/best-effort subscription validation
- subscription outcome mapping tests (`ack`, `retry`, delayed-retry strictness checks)
- subscription outcome mapping tests (`ack`, `retry`, `deadLetter`, `drop`, `stop-consumer`) plus strict capability guards
- in-flight execution per-kind tracker tests

## Follow-up items

- Add first-class CLI commands and audit views for queue worker and subscription consumer pause/resume state (deferred; runtime APIs are now formalized and stable).
- Evaluate additional queue providers (`AWS SQS`, `Azure Storage Queue`) only when they can satisfy the existing pull + lease + ack contract without semantic hacks.

## Current status

- Queue API cleanup is complete for the current wave:
  - `QueueJobContext.job.moveToDeadLetter(...)` is part of the runtime contract.
  - Queue bridge DLQ/operator APIs (`peek`, `redrive`, `purge`, `inspectLeases`) are implemented.
  - Queue bridge capabilities expose operator and strict-startup traits.
  - dead queue API knobs removed from core (`QueueDefinition.deadLetter.emitEvent/eventName`).
- Additional provider coverage is intentionally limited to existing providers in this wave:
  - production baseline: Redis queue bridge
  - additional production provider: NATS JetStream queue bridge
  - no new queue provider packages are introduced in this slice.
