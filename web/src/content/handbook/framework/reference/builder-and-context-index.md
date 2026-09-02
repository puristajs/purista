---
title: Builder and handler-context index
description: Find the builder that declares a capability and the context surface that becomes available inside its handler.
order: 1225
---

PURISTA builders declare contracts before runtime. A declaration adds metadata,
schema-derived types, and selected handler capabilities; the service instance
then enforces the same contract at execution time.

## Find the owning builder

| Build | Start with | Handler/context owner |
| --- | --- | --- |
| Service boundary | [`ServiceBuilder`](/handbook/api/classes/_purista_core.ServiceBuilder/) | Service resources, configuration, metrics, stores, and registered definitions |
| Request/response action | [`CommandDefinitionBuilder`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/) | `CommandFunctionContext` plus declared invokes, streams, queues, events, agents, and workflows |
| Event reaction | [`SubscriptionDefinitionBuilder`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/) | `SubscriptionFunctionContext` plus the declared downstream capabilities |
| Incremental session | [`StreamDefinitionBuilder`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/) | `StreamFunctionContext` and `StreamWriter` |
| Durable job contract | [`QueueDefinitionBuilder`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/) | Queue payload, parameter, result, scheduling, and lifecycle metadata |
| Queue execution | [`QueueWorkerBuilder`](/handbook/api/classes/_purista_core.QueueWorkerBuilder/) | `QueueWorkerFunctionContext` and `context.job` controls |
| External schedule contract | [`ScheduleDefinitionBuilder`](/handbook/api/classes/_purista_core.ScheduleDefinitionBuilder/) | No in-process schedule handler; the chosen target owns execution |

## Map declarations to context

| Declaration | Context surface | Runtime boundary |
| --- | --- | --- |
| `defineResource(name)` | `context.resources[name]` | The resource is required in `getInstance(...)`. |
| `defineMetric(name, definition)` | `context.metrics[name]` | Recording needs an application-owned Meter/exporter. |
| `canInvoke(...)` | `context.service.<name>[version].<target>(...)` | The call uses EventBridge and propagates principal and tenant identity. |
| `canConsumeStream(...)` | `context.stream.<name>[version].<target>(...)` | The EventBridge must advertise stream support. |
| `canEnqueue(...)` | `context.queue.enqueue.<queue>(...)` | The named queue must be registered and the QueueBridge started. |
| `canEmit(...)` | `context.emit(eventName, payload)` | The payload is checked against the declared event schema. |
| `canInvokeAgent(...)` / `canInvokeWorkflow(...)` | `context.agent` / `context.workflow` | Address-first calls use EventBridge and the mounted Harness contract. |

Common logger, tracing, stores, message metadata, `principalId`, and `tenantId`
are described in [Handler inputs and context](/handbook/framework/build-services/handler-context/).
Treat identity as authenticated caller data, then enforce business access in a
guard. A context property being present is not authorization.

## Test at the correct boundary

Use the matching context mock for focused handler logic. Use command, stream,
or queue-worker runtime harnesses for full Framework ordering. Subscriptions
currently provide a typed context mock and direct builder helpers, but no
`createSubscriptionTestHarness`. Use a service plus a deterministic EventBridge
when the complete subscription lifecycle matters.

Next: [configuration and environment variables](/handbook/framework/reference/configuration-and-environment-variables/).
