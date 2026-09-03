---
title: Define and record metrics
description: Export PURISTA framework instruments and add low-cardinality application metrics through typed service definitions.
order: 1024
---

PURISTA records framework lifecycle metrics when the component receives an
OpenTelemetry Meter. A service may also declare typed application metrics with
`defineMetric(...)`; handlers then record them through `context.metrics`.

## Define an application metric

```ts title="src/service/order/v1/orderV1ServiceBuilder.ts"
import { ServiceBuilder } from '@purista/core'
import { z } from 'zod'
import { orderV1ServiceInfo } from './orderV1ServiceInfo.js'

const orderMetricAttributesSchema = z.object({
  channel: z.enum(['web', 'partner']),
})

export const orderV1ServiceBuilder = new ServiceBuilder(orderV1ServiceInfo)
  .defineMetric('app.orders.created', {
    kind: 'counter',
    unit: '{order}',
    description: 'Accepted orders',
    attributes: orderMetricAttributesSchema,
  })
```

[`defineMetric(name, definition)`](/handbook/api/classes/_purista_core.ServiceBuilder/#definemetric)
adds a typed instrument to every handler context built from this service. Use a
counter for totals, a histogram for distributions such as duration, and an
up-down counter for a value that can increase and decrease. `attributes` is an
optional Standard Schema object, not a list of names; it validates the
attribute values and gives `context.metrics` its argument type.

```ts title="src/service/order/v1/command/createOrder/createOrderCommandBuilder.ts"
export const createOrderCommandBuilder = orderV1ServiceBuilder
  .getCommandBuilder('createOrder', 'Create one order')
  .addPayloadSchema(createOrderInputSchema)
  .addOutputSchema(orderSchema)
  .setCommandFunction(async function (context, payload) {
    const order = await context.resources.orders.create(payload)
    context.metrics['app.orders.created'].add(1, { channel: payload.channel })
    return order
  })
```

[`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder)
creates the service-owned operation. [`addPayloadSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema)
and [`addOutputSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema)
type and validate the handler input and result. [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction)
installs the required service-bound handler; metric recording does not alter
its result contract or make a failed command successful.

The declaration is part of the service contract; the Meter and exporter stay
in the composition root. Keep attributes bounded. A small enum such as
`channel` is suitable. A customer, tenant, request, trace, job, prompt, or
arbitrary error message is not.

## Know the built-in catalog

The full source-verified catalog is exported as
[`frameworkMetricDefinitions`](/handbook/api/variables/_purista_core.frameworkMetricDefinitions/).

| Area | Instruments |
| --- | --- |
| Commands | `purista.command.executions`, `purista.command.duration` |
| Subscriptions | `purista.subscription.executions`, `purista.subscription.duration` |
| Streams | `purista.stream.executions`, `purista.stream.duration`, `purista.stream.frames`, `purista.stream.active` |
| Queues and workers | `purista.queue.jobs`, `purista.queue.oldest_job_age`, `purista.queue.operation.duration`, `purista.queue.worker.executions`, `purista.queue.worker.duration` |
| Stores and resources | `purista.store.operations`, `purista.store.operation.duration`, `purista.resource.active`, `purista.resource.init.duration` |
| Bridges and messaging | `purista.bridge.messages`, `purista.bridge.operation.duration`, `messaging.client.operation.duration`, `messaging.client.sent.messages`, `messaging.client.consumed.messages`, `messaging.process.duration` |
| HTTP | `http.server.request.duration`, `http.server.active_requests`, `http.client.request.duration` |
| Agents | `purista.agent.runs`, `purista.agent.run.duration`, `purista.agent.active` |
| Health | `purista.health.status`, `purista.health.check.duration` |

Execution counters use the `purista.outcome` attribute. Duration instruments
use the unit shown by the catalog: framework lifecycle durations use
milliseconds, while HTTP and messaging semantic-convention durations use
seconds. Build dashboards from the exported names and units rather than
renaming them in application code.

## Wire and verify the Meter

Pass the same application-owned Meter policy to every independently constructed
component whose metrics you need:

```ts title="src/index.ts"
const eventBridge = new DefaultEventBridge({ metrics: { meter } })
await eventBridge.start()

const orderService = await orderV1Service.getInstance(eventBridge, {
  metrics: { meter },
  resources: { orders },
})
await orderService.start()
```

Run one successful and one rejected command. Verify that
`purista.command.executions` separates their outcomes and that
`app.orders.created` increases only for the successful business action. If no
series appears, confirm that the MeterProvider has a reader/exporter and that
`recordFrameworkMetrics` or `recordCustomMetrics` was not disabled.

Next: [trace commands, events, streams, and jobs](/handbook/framework/secure-and-operate/observability/trace-commands-events-streams-and-jobs/).
