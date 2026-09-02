---
title: Instantiate and start a service
description: Construct concrete dependencies at the composition root, create the service with its runtime bindings, then start and stop it in the required order.
order: 316
---

The composition root owns concrete adapters, credentials, and process lifecycle.
The service owns its declared contracts and runtime registration. Start the
EventBridge before creating/starting the service;
[`getInstance(eventBridge, options?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getinstance)
does not start the EventBridge or the service.

```ts title="src/index.ts"
import { DefaultEventBridge } from '@purista/core'
import { invoiceV1Service } from './service/invoice/v1/invoiceV1Service.js'
import { createInvoiceRepository } from './resource/createInvoiceRepository.js'

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

const service = await invoiceV1Service.getInstance(eventBridge, {
  resources: { invoices: await createInvoiceRepository() },
  serviceConfig: { reminderWindowDays: 14 },
})

await service.start()
```

## Wire only what the service needs

| `getInstance` option | Default when omitted | Owner and verification |
| --- | --- | --- |
| `serviceConfig` | Builder default then schema default | Schema validates before an instance is returned; invalid input rejects creation. |
| `resources` | Required when `defineResource` was used | Application supplies the declared implementations. |
| `stateStore`, `configStore`, `secretStore` | Included default stores | Replace with a configured production adapter before relying on durability, external config, or secret protection. |
| `queueBridge`, `queueJobStore` | `DefaultQueueBridge`; no job store | Queue work and optional job-result state. A QueueBridge starts only when queue features exist. |
| `logger`, `logLevel` | Default logger; custom logger wins | Structured application logging. |
| `spanProcessor`, `metrics`, `metricsRecorder` | No supplied processor/recorder | Traces and metrics for this running service process. |
| `ai` | No explicit binding | Attached-agent runtime bindings only. |

On [`start()`](/handbook/api/classes/_purista_core.Service/#start), the service validates its config again, checks EventBridge health,
announces initialization, registers commands/subscriptions/streams, then starts
and checks QueueBridge only for queue features before starting workers. It
announces ready only after those steps succeed.

Call [`destroy()`](/handbook/api/classes/_purista_core.Service/#destroy) during shutdown. It cancels active streams, stops workers,
destroys a QueueBridge that this service started, and performs base teardown.
That includes a supplied QueueBridge when this service started it. Do not share
one QueueBridge between services that may be destroyed independently unless the
application coordinates their shutdown; otherwise one service can destroy the
bridge still needed by another. The application still owns EventBridge shutdown
and any external resource or adapter lifecycle that it created.

For production bridge/store enablement, follow the specific adapter guide;
installation alone does not wire an adapter into this service.
