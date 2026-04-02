---
title: NATS Queue Bridge
description: Durable pull-based queues backed by NATS JetStream.
order: 301530
---

# NATS Queue Bridge

`@purista/nats-queue-bridge` provides a JetStream-backed queue bridge for teams that already operate NATS and want queue semantics without introducing Redis only for pull-based workloads.

## Capabilities

| feature | support |
| --- | --- |
| Durability | ✅ (JetStream streams + durable pull consumers) |
| Delayed delivery | ✅ (scheduled stream with due-job release) |
| Dead-letter queue | ✅ (dedicated DLQ streams per logical queue) |
| Lease extension | ✅ (`working()` heartbeats + lease inspection) |
| Lease expiry recovery | ✅ (ack timeout redelivery) |
| DLQ inspect / replay / purge | ✅ |

## Safe defaults

- JetStream is required. The bridge does not fall back to core NATS.
- FIFO queue consumption and `prefetch: 1` are the intended defaults.
- DLQ naming follows the standard PURISTA suffix resolution, so service health and queue metrics resolve the same target.
- Short lease TTLs are honored by adjusting the queue consumer ack timeout, while long-running workers should still call `context.job.extendLease(...)`.

## Operational notes

- This bridge is best when the same platform already uses NATS for event traffic and wants one operational stack.
- DLQ replay is bridge-managed, not a JetStream “magic queue replay” feature. Operators should inspect the failed payload and reason before redriving.
- Scheduled jobs are stored separately from immediately runnable jobs, so delayed workloads do not block normal queue throughput.

## Related links

- [Queue bridges overview](./index.md)
- [Queues overview](../../2_building_business-logic/queue/index.md)
- [NATS event bridge](../eventbridges/nats.md)
