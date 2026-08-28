---
title: Apply patterns and recipes
description: Combine established PURISTA primitives for common enterprise workflows without replacing their canonical guides.
order: 800
---

Use a recipe after you understand its primitives. A recipe explains the boundary and trade-offs of a real workflow; it does not redefine commands, queues, adapters, or security controls.

| Situation | Recipe | Compose |
| --- | --- | --- |
| A platform scheduler must start a durable result flow | [Schedule work](/handbook/framework/build-services/schedule-event-queue-result/) | Schedule contract, event, queue/worker, result event |
| HTTP accepts work that outlives the request | [Asynchronous request processing](/handbook/framework/apply-patterns-and-recipes/asynchronous-request-processing/) | HTTP command, queue, state/result query |
| A write model and independently shaped read model evolve at different rates | [CQRS and projections](/handbook/framework/apply-patterns-and-recipes/cqrs-and-projections/) | Command, success event, subscription, read-model resource |
| The business event log is deliberately the source of truth | [Event sourcing](/handbook/framework/apply-patterns-and-recipes/event-sourcing/) | Durable event log, projections, replay, explicit application ownership |
| Several independent services need a shared message contract | [Enterprise interoperability](/handbook/framework/apply-patterns-and-recipes/enterprise-interoperability/) | EventBridge, schemas, client/export |
| Services need separate lifecycle but one deployable | [Modular monolith](/handbook/framework/apply-patterns-and-recipes/modular-monolith/) | Direct calls, in-process bridge |
| Services scale/deploy independently | [Distributed microservices](/handbook/framework/apply-patterns-and-recipes/distributed-microservices/) | Durable bridge, discovery, operations |

PURISTA records schedule contracts and can export schedule/Kubernetes CronJob artifacts, but it does not ship an in-process production scheduler provider. Temporal-specific orchestration remains outside the canonical Framework path until a maintained public integration is available. PURISTA also supports the command/event/subscription pieces of CQRS and event-driven projections; it does not silently supply an event-sourcing event log, projection database, or replay policy.

Next: [schedule work](/handbook/framework/build-services/schedule-event-queue-result/), [queues and workers](/handbook/framework/build-services/queues-and-workers/), and [distributed infrastructure](/handbook/framework/connect-distributed-infrastructure/).
