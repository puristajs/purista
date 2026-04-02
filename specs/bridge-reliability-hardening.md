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
- in-flight execution per-kind tracker tests

## Follow-up items

- Extend runtime pause/resume controls into first-class CLI/operator commands in addition to direct service APIs.
- Add deeper provider fault-injection tests for confirm / publish failures, not just happy-path broker integrations.
- Extend the new queue adapter pattern to additional providers only when they match the pull + lease + ack contract cleanly.

## Next implementation slice

The next hardening phase is no longer about basic bridge bugs. It is about making queue handling and subscription handling production-complete while preserving PURISTA’s current architecture and reducing complexity.

### Priorities

- Defaults first:
  - safe production defaults must exist everywhere practical so teams can start quickly with low effort and limited broker expertise
  - startup must fail fast when a requested guarantee cannot be honored in strict mode
- Public API honesty:
  - code, docs, and runtime behavior must match exactly
  - dead config and fake knobs should be implemented or removed
- Operator controls:
  - DLQ inspect / replay / purge must become first-class queue operations
  - poison-message quarantine / worker pause needs an explicit model
- Code cleanup:
  - reduce duplicated retry / DLQ handling across adapters
  - prefer reusable helpers and smaller surfaces over more inheritance
  - breaking changes are acceptable if they simplify the model and improve truthfulness

### Queue backlog

- add explicit `moveToDeadLetter` support to the queue job context or remove the docs promise
- add queue bridge APIs for DLQ inspection, replay, and purge
- add capability flags for those operations
- keep safe defaults explicit everywhere so new users can start with low effort and limited broker knowledge
- implement or remove currently dead queue fields / knobs:
  - queue bridge config hints that are not enforced
  - `partitionKey`
  - `idempotencyKey`
  - DLQ event emission knobs
- keep Redis as the production baseline and prioritize JetStream as the next queue adapter candidate

### Subscription backlog

- tighten `consumerFailureHandling` so it is less ambiguous and more capability-driven
- add explicit strict vs best-effort handling for requested semantics
- add portable fatal / transient / dead-letter-now style outcomes for subscription consumers
- harden NATS and AMQP retry / DLQ hops so the retry / dead-letter publish is confirmed before the original delivery is settled

### Queue adapter roadmap

Queue adapters should be added only when they fit the existing pull + lease + ack architecture without semantic hacks.

- keep: Redis
- next preferred: NATS JetStream pull consumers
- evaluate after that: AWS SQS / SQS FIFO, Azure Storage Queues
- not qualified today: MQTT, HTTP, classic push-style AMQP / RabbitMQ consumer model
