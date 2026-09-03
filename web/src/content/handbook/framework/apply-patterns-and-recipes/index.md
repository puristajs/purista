---
title: Apply patterns and recipes
description: Combine established PURISTA primitives for common enterprise workflows without replacing their canonical guides.
order: 800
---

Use a recipe when one business outcome genuinely combines several established
PURISTA primitives. Primitive setup stays in Build services, adapter setup in
distributed infrastructure, and process topology in Deploy applications. This
chapter owns only the cross-capability decision, end-to-end flow, and failure
boundary.

| Situation | Recipe | Compose |
| --- | --- | --- |
| A platform scheduler must start a durable result flow | [Schedule work](/handbook/framework/build-services/schedule-work/) | Schedule contract, event, queue/worker, result event |
| HTTP accepts work that outlives the request | [Asynchronous request processing](/handbook/framework/apply-patterns-and-recipes/asynchronous-request-processing/) | HTTP command, queue, state/result query |
| A write model and independently shaped read model evolve at different rates | [CQRS and projections](/handbook/framework/apply-patterns-and-recipes/cqrs-and-projections/) | Command, success event, subscription, read-model resource |
| The business event log is deliberately the source of truth | [Event sourcing](/handbook/framework/apply-patterns-and-recipes/event-sourcing/) | Durable event log, projections, replay, explicit application ownership |
| A business process must survive restarts, long waits, and external callbacks | [Long-running workflows with Temporal](/handbook/framework/apply-patterns-and-recipes/long-running-workflows-with-temporal/) | Temporal workflow and activities, EventBridge command invocation, signals, OpenTelemetry |
| Several independent services need a shared message contract | [Enterprise interoperability](/handbook/framework/apply-patterns-and-recipes/enterprise-interoperability/) | EventBridge, schemas, client/export |

PURISTA records schedule contracts and can export schedule/Kubernetes CronJob
artifacts, but it does not ship an in-process production scheduler provider.
For durable, stateful orchestration, Temporal remains an application-owned
integration: Temporal owns workflow history and timers, while PURISTA owns
addressed business capabilities and message delivery. PURISTA supports the
command/event/subscription pieces of CQRS and projections; it does not silently
supply an event-sourcing log, projection database, replay policy, or exactly-once
business execution.

For process shape, use the dedicated [deployment selection guide](/handbook/framework/deploy-applications/).
Keeping service boundaries in one process is a deployment task, not an
application pattern recipe. Extracting distributed services starts from the
same guide and then uses the EventBridge and QueueBridge adapter chapters.

Next: [asynchronous request processing](/handbook/framework/apply-patterns-and-recipes/asynchronous-request-processing/)
or [choose a deployment topology](/handbook/framework/deploy-applications/).
