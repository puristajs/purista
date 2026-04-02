---
title: Delivery Semantics and Reliability
description: How to design stable PURISTA systems with realistic broker guarantees
order: 209920
---

# Delivery semantics and reliability

## Guarantee model

End-to-end message delivery guarantees are a combination of:

1. the selected PURISTA event bridge
2. broker/component configuration
3. your handler design (idempotency, retries, side effects)

## Common modes

- `at-most-once`: lower overhead, messages can be lost
- `at-least-once`: safer delivery, duplicates are expected
- `exactly-once`: rarely guaranteed end-to-end across distributed side effects

## Design rules for production

- make command/subscription side effects idempotent
- use deterministic business keys for deduplication
- avoid non-atomic “read/modify/write” side effects without protection
- set timeout and retry budgets intentionally
- persist important business state outside process memory

## Safe defaults

PURISTA now defaults to strict startup validation for reliability-sensitive command and subscription semantics.

- if a handler requests delivery behavior a bridge cannot honor, startup fails in strict mode
- late command responses after timeout are ignored with warning where applicable
- stream sessions use bounded timeout handling and terminal-frame enforcement instead of open-ended waits
- queue workers apply bounded retries and dead-letter routing using lifecycle defaults unless you override them

### Canonical defaults table

| area | default | behavior |
| --- | --- | --- |
| command invocation timeout | bridge `defaultCommandTimeout` (30s unless configured) | caller timeout is terminal; late responses are ignored with warning |
| stream invocation timeout | bridge `defaultCommandTimeout` (unless stream timeout override is configured) | late frames after timeout/terminal are ignored with warning |
| subscription failure handling | `mode: 'strict'`, `maxAttempts: 1`, `retryDelayMs: 0` when configured without overrides | startup rejects unsupported semantics; exhausted attempts dead-letter when configured |
| queue lifecycle retry | `maxAttempts: 10`, exponential retry strategy, `retryWindowMs: 24h` | retries stay bounded and route to DLQ after budget/window exhaustion |

## Drain observability

Event bridges expose in-flight diagnostics by work kind (`command`, `subscription`, `stream`, `generic`).
Services can use this during shutdown and operator diagnostics to verify that drain reached zero before teardown.

For service-level operators, use `Service.getInFlightDiagnostics()` as the canonical API:

- `total`: all in-flight handlers
- `byKind`: in-flight handlers split by `command`, `subscription`, `stream`, `generic`

## Subscription control outcomes

Subscription handlers can return explicit outcomes:

- `ack`: settle as successful
- `retry`: request retry, optionally with `delayMs`
- `deadLetter`: route directly to dead-letter handling
- `drop`: settle and discard the current delivery with a warning
- `stop-consumer`: pause the subscription consumer and require explicit operator resume

`stop-consumer` is implemented as consumer pause (not service shutdown).  
Use `Service.getPausedSubscriptionConsumerState()` for diagnostics and `Service.resumeSubscriptionConsumer(registrationKey)` to resume.

## Health and paused-state semantics

Service health now includes paused operational state as first-class observability:

- paused queue workers are exposed in `ServiceHealthState.pausedQueueWorkers`
- paused subscription consumers are exposed in `ServiceHealthState.pausedSubscriptionConsumers`
- if either list is non-empty, service health is `warn`

This is additive observability: event bridge health, queue bridge health, and queue metrics evaluation keep their existing behavior.

## Streams and reliability

Current stream runtime support is available in `DefaultEventBridge` only.

For stream consumers:

- handle terminal frames (`complete`, `error`, `cancel`) explicitly
- treat cancellation as a normal control path
- validate chunk/final payloads where needed
- keep chunk processing resilient to partial interruptions
- expect exactly one terminal state (`complete`, `error`, or `cancel`) per session

## Minimal acceptance checklist

- broker-level delivery mode is documented for each environment
- duplicate-handling strategy is tested
- retry policy is tested against transient failures
- operational runbook includes outage and reconnect behavior
