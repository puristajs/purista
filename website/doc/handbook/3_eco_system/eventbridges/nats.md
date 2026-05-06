---
title: NATS Event Bridge
description: Use NATS with PURISTA
order: 301050
---

![NATS event bridge](/graphic/nats_event_bridge_header.png)

# NATS Event Bridge

The `@purista/natsbridge` package integrates NATS subject-based routing.

## Delivery semantics

For core NATS without JetStream persistence, behavior is typically:

- durability: no persistent backlog
- retries: application-level retry patterns required
- typical delivery mode: at-most-once

When JetStream is available, subscriptions and durable commands can use JetStream consumers with explicit acknowledgements.

For subscriptions, PURISTA now supports a bounded consumer failure policy:

- manual ack path for `autoacknowledge: false`
- configurable retry budget (`consumerFailureHandling.maxAttempts`)
- configurable retry delay (`consumerFailureHandling.retryDelayMs`)
- dead-letter publish to an explicit subject or a derived default subject
- strict startup validation when `consumerFailureHandling.mode` is left at the safe default (`strict`)
- explicit handler outcomes:
  - `drop`: ack and discard current delivery with warning
  - `stop-consumer`: pause the affected JetStream subscription consumer until explicit resume

The default NATS bridge configuration applies a bounded retry budget for JetStream-backed subscriptions. Per-subscription failure handling hints override that adapter default.
JetStream processing timeout/redelivery is configured at broker level via `jetStreamAckWaitMs` (or command-specific timeout override), so redelivery is driven by JetStream rather than a PURISTA timer loop.

For command invocation, PURISTA uses native NATS request/reply timeout handling (`connection.request(..., { timeout })`). This keeps timeout enforcement on broker protocol level instead of running a parallel PURISTA timeout registry for NATS commands.
Command handlers are single-shot request/response: on failure the bridge responds with `CommandErrorResponse` (`UnhandledError`) and settles the delivery instead of retrying command execution.

For dead-letter handoff safety, PURISTA publishes to the dead-letter subject first and only terminates the original JetStream delivery after publish acknowledgement.

If a registration requests `durable: true` against a broker without JetStream, the bridge fails fast in `strict` mode instead of silently falling back to non-durable core NATS behavior.

## Stream support

PURISTA stream runtime (`openStream`) is currently not implemented for NATS bridge.

## Reliability recommendations

- design handlers idempotent even when retries are app-driven
- keep subject prefix configuration identical across instances
- enable JetStream on the broker when you rely on `durable: true`
- keep dead-letter subjects on JetStream as operator inboxes and replay them intentionally
- monitor dead-letter subjects and treat them as operator inboxes, not silent sinks
- prefer queue bridges for long-running workflows or replay-heavy remediation
- validate timeout/error behavior under broker disconnect scenarios
