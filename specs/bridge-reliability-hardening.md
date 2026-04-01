# Bridge Reliability Hardening

Source of truth: [`specs/35-bridge-reliability/00-requirements.md`](/Users/sebastianwessel/projekte/@purista/specs/35-bridge-reliability/00-requirements.md)

This document tracks the `purista` monorepo implementation status for the bridge reliability hardening slice.

## Implemented in this monorepo

- Added `EventBridgeCapabilities` and shared late-response handling primitives in core.
- Replaced bridge-local pending invocation maps with a shared pending invocation registry where relevant.
- Hardened `DefaultQueueBridge` lease expiry recovery and retry-to-DLQ flow.
- Hardened `RedisQueueBridge` delayed-release and expired-lease recovery with atomic claim scripts.
- Fixed `HttpEventBridge` lifecycle state transitions.
- Changed `AmqpBridge` durable command defaults to manual ack and non-auto-delete queues.
- Added shared in-flight execution drain tracking in core and reused it across bridge implementations.
- Implemented JetStream durable consumers for `NatsBridge` when JetStream is available, while keeping strict fail-fast behavior for brokers without JetStream.
- Added advisory subscription consumer failure handling in core so adapters can honor bounded retry and dead-letter behavior without coupling service definitions to one transport.
- Updated handbook pages so support matrices and reliability wording match current runtime behavior.

## Test coverage landed

- event bridge timeout and late-response behavior
- HTTP readiness lifecycle
- AMQP safe durable defaults and shutdown rejection
- NATS strict durable rejection
- NATS subscription retry-to-success and retry-to-dead-letter integration coverage
- MQTT topic helpers and bridge lifecycle behavior
- default queue bridge lease recovery
- Redis queue bridge contract/integration suite, skipped automatically when Docker is unavailable

## Follow-up items

- Expand Redis integration coverage for competing workers when container runtime support is available in CI.
