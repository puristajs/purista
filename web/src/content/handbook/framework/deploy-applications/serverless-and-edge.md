---
title: Deploy to serverless and edge runtimes
description: Match PURISTA component lifecycles, transport support, and durable work to short-lived or restricted runtime environments.
order: 1055
---

Serverless and edge platforms can host a bounded HTTP adapter or trigger, but
their execution, socket, filesystem, and shutdown limits determine which
PURISTA components can run safely. Check the selected package's Node.js APIs
and the platform's process model before deploying it.

## Choose the supported shape

| Runtime shape | Suitable work | Keep elsewhere |
| --- | --- | --- |
| Request-scoped function | Validate/authenticate HTTP input and invoke a distributed EventBridge target with a bounded timeout. | Long-running workers, in-memory state, broker listeners, and local schedules. |
| Scheduled function | Authenticate and emit, enqueue, or invoke one idempotent declared target. | Business retries and overlap recovery; queues/workers own those. |
| Edge isolate | Small application-owned fetch adapter when all imported packages support the isolate APIs. | Node-only adapters, TCP clients, filesystem-backed skills/sandboxes, and native modules. |
| Long-lived serverless container | A normal service or Hono process when the platform provides readiness, drain, and bounded shutdown. | Assumptions that an instance or local store survives replacement. |

The default EventBridge and stores keep data only in one process. They do not
connect separate invocations and cannot provide durable state. Use distributed
bridges, queues, stores, and databases as application infrastructure.

## Verify the platform lifecycle

1. Build for the exact runtime and reject unsupported Node.js imports.
2. Start or reuse adapters according to the platform's instance lifecycle.
3. Enforce request and downstream timeouts below the platform deadline.
4. Send one authenticated synthetic request and verify its remote command,
   event, or queued job.
5. Force instance replacement and prove that required state and work survive in
   external systems.
6. Verify cancellation, telemetry flush, and duplicate delivery behavior.

Do not run business work after returning an HTTP response unless a durable
queue accepted it first. A platform promise to keep an invocation warm is a
performance hint, not a lifecycle or durability guarantee.

Next: [compile and run distributed services](/handbook/framework/deploy-applications/distributed-services/).
