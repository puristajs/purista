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

## Streams and reliability

Current stream runtime support is available in `DefaultEventBridge` only.

For stream consumers:

- handle terminal frames (`complete`, `error`, `cancel`) explicitly
- treat cancellation as a normal control path
- validate chunk/final payloads where needed
- keep chunk processing resilient to partial interruptions

## Minimal acceptance checklist

- broker-level delivery mode is documented for each environment
- duplicate-handling strategy is tested
- retry policy is tested against transient failures
- operational runbook includes outage and reconnect behavior
