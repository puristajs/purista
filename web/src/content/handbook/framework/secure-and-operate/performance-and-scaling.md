---
title: Performance and scaling
description: Measure queue age, concurrency, resource latency, and backpressure before changing topology or parallelism.
order: 1050
---

Scale from evidence. Start with service/bridge/queue metrics and traces to find
the constrained resource: a worker concurrency limit, external API, broker
consumer, database, or HTTP connection pool.

## Diagnose the bottleneck before increasing parallelism

| Signal | Likely constraint | First safe action |
| --- | --- | --- |
| Queue backlog and oldest-job age rise; downstream latency is stable | Too few healthy consumers | Add bounded worker capacity and observe again |
| Queue retries and downstream latency rise together | Provider/database is saturated or failing | Reduce pressure, apply backoff, repair the dependency |
| HTTP latency rises but queues are healthy | Request handler, pool, or upstream call | Trace the slow path; set an explicit timeout/budget |
| CPU/event-loop pressure rises | In-process work is too expensive | Move repeatable slow work to a queue or split the workload |
| Only one tenant dominates backlog | Fairness/partition design is missing | Isolate or partition work without exposing tenant IDs as metric labels |

For Redis and NATS QueueBridge, queue-level metrics include operational counts
such as pending and dead-letter jobs; Redis also derives oldest pending job age
and retry count. Treat those as a feedback loop, not a reason to autoscale
without a dependency budget.

Increase queue worker parallelism only after handlers, dependencies, and
idempotency tolerate concurrent delivery. Use queue backlog, oldest-job age,
retries, dead-letter count, and resource latency as operational signals. Set
connection-pool and provider rate limits to match the new concurrency; otherwise
more workers merely create a faster failure loop. Avoid using tenant or user
identifiers as metric labels; they create high-cardinality cost and privacy
risk.

Load-test the complete deployed path—adapter, worker, database/provider, and
telemetry—with representative payload size and failure behavior. A local
in-memory bridge cannot establish production queue throughput or recovery
limits.

Next: [chapter overview](/handbook/framework/secure-and-operate/).
