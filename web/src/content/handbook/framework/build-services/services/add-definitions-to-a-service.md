---
title: Add definitions to a service
description: Register the service's declared capabilities once, bind event-to-queue work deliberately, and resolve the aggregate only after it is complete.
order: 312
---

The service aggregate is a small registration index. It owns no business logic;
it tells the runtime which focused definitions form this versioned service.
Add every definition before a service is instantiated, tested, or explicitly
resolved.

```ts title="src/service/invoice/v1/invoiceV1Service.ts"
export const invoiceV1Service = invoiceV1ServiceBuilder
  .addCommandDefinition(createInvoiceCommandBuilder.getDefinition())
  .addSubscriptionDefinition(invoicePaidSubscriptionBuilder.getDefinition())
  .addStreamDefinition(invoiceProgressStreamBuilder.getDefinition())
  .addQueueDefinition(generateInvoiceQueueBuilder.getDefinition())
  .addQueueWorkerDefinition(generateInvoiceWorkerBuilder.getDefinition())
```

| Builder call | Registers | Keep detailed options in |
| --- | --- | --- |
| [`addCommandDefinition(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addcommanddefinition) | Request/response operations | [Commands](/handbook/framework/build-services/commands/) |
| [`addSubscriptionDefinition(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addsubscriptiondefinition) | Event reactions | [Subscriptions](/handbook/framework/build-services/subscriptions/) |
| [`addStreamDefinition(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addstreamdefinition) | Progressive response producers | [Streams](/handbook/framework/build-services/streams/) |
| [`addQueueDefinition(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addqueuedefinition) / [`addQueueWorkerDefinition(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addqueueworkerdefinition) | Durable job contract and executable worker | [Queues and workers](/handbook/framework/build-services/queues-and-workers/) |
| [`addScheduleDefinition(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addscheduledefinition) | Scheduler contract metadata | [Schedule work](/handbook/framework/build-services/schedule-event-queue-result/) |
| [`addAgentDefinition(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addagentdefinition) | Attached agent plus its generated command, stream, queue, worker, and metrics | [Build AI-powered services](/handbook/framework/build-ai-powered-services/) |

[`bindEventToQueue(eventName, queueName, options?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#bindeventtoqueue) creates a bounded
event-to-queue handoff. Use it when an event must become durable work without
putting queue access in a subscription. Its options control idempotency mode/key,
payload/parameter mapping, and enqueue-failure behavior; configure and test
them in [Queues and workers](/handbook/framework/build-services/queues-and-workers/).

| `bindEventToQueue` option | Default / accepted value | Use it for |
| --- | --- | --- |
| `idempotencyMode` | `'advisory'`; also `'strict'` | State whether the handoff can proceed when the selected queue bridge cannot honor its idempotency key. Choose `strict` only when a supported bridge and a stable key are a deployment prerequisite. |
| `idempotencyKey` | Omitted; `'none'`, `'messageId'`, `'correlationId'`, `'eventField'`, or a function of the incoming event | Produce a stable queue deduplication key. Use an explicit function when none of the built-in identity strategies matches the business effect. |
| `mapPayload` | Omitted; the event payload is passed through | Map a narrow event fact to the queue contract. Keep the mapper deterministic and validate the resulting queue payload. |
| `mapParameter` | Omitted | Derive a queue parameter from the event when the queue contract requires one. |
| `onEnqueueFailure` | Omitted; enqueue failure follows the generated subscription error path | Return retry metadata or `{ status: 'fail', reason }` when the event-to-queue handoff needs a deliberate recovery decision. |

## Resolve only after assembly is complete

All add calls accept definitions or promises of definitions. The first
[`resolveDefinitions()`](/handbook/api/classes/_purista_core.ServiceBuilder/#resolvedefinitions), [`getInstance(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getinstance), [`testServiceSetup()`](/handbook/api/classes/_purista_core.ServiceBuilder/#testservicesetup), or full
definition lookup resolves them, caches the results, and clears the pending
lists. Every later `add…Definition(...)` and `bindEventToQueue(...)` call
throws. This makes a service definition immutable for a running instance.

Do not conditionally add a feature after application startup. Build a complete
aggregate for each intended service shape, then construct and start it.

[`getFullServiceDefinition()`](/handbook/api/classes/_purista_core.ServiceBuilder/#getfullservicedefinition) is the aggregate-inspection entry point after resolution. The individual
`getCommandDefinitions()`, `getSubscriptionDefinitions()`,
`getStreamDefinitions()`, `getQueueDefinitions()`,
`getQueueWorkerDefinitions()`, and `getScheduleDefinitions()` accessors are
exact post-resolution lookup APIs; each throws before definitions are resolved.
They inspect the completed aggregate—they do not register or start a service.

For signatures, see [ServiceBuilder](/handbook/api/classes/_purista_core.ServiceBuilder/).
