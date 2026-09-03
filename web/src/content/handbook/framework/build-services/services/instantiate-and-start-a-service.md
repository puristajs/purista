---
title: Instantiate and start a service
description: Construct concrete dependencies at the composition root, create the service with its runtime bindings, then start and stop it in the required order.
order: 317
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

| `getInstance` option | Default when omitted | Owner and verification | Fails with |
| --- | --- | --- | --- |
| `serviceConfig` | Builder default then schema default | Schema validates before an instance is returned; invalid input rejects creation. | `UnhandledError(500, 'The given service configuration is invalid', issues)` |
| `resources` | Required when `defineResource` was used | Application supplies the declared implementations. | `UnhandledError(500, 'This services requires resources to be set in getInstance options')` |
| `stateStore`, `configStore`, `secretStore` | Included default stores | Replace with a configured production adapter before relying on durability, external config, or secret protection. | Adapter construction or runtime store errors. |
| `queueBridge`, `queueJobStore` | `DefaultQueueBridge`; no job store | Queue work and optional job-result state. A QueueBridge starts only when queue features exist. | Health and capability failures occur at `start()`. |
| `logger`, `logLevel` | Default logger; custom logger wins | Structured application logging. | Logger construction is application-owned. |
| `spanProcessor`, `metrics`, `metricsRecorder` | No supplied processor/recorder | Traces and metrics for this running service process. | Provider/export failures follow the selected telemetry implementation. |
| `ai` | No explicit binding | Runtime bindings required by an attached Harness mount. | `UnhandledError(500, 'This service mounts a Harness and requires ai runtime configuration.')` |

On [`start()`](/handbook/api/classes/_purista_core.Service/#start), the service validates its config again, checks EventBridge health,
announces initialization, registers commands/subscriptions/streams, then starts
and checks QueueBridge only for queue features. Before starting workers it
validates strict FIFO, prefetch, and event-to-queue idempotency requirements
against the bridge capabilities; a mismatch throws `UnhandledError(501, ...)`.
It
announces ready only after those steps succeed.

EventBridge health failure throws `UnhandledError(503, 'eventbridge not healthy')`;
QueueBridge health failure throws `UnhandledError(503, 'queue bridge not healthy')`.
After success, observe `InfoServiceReady`, the
`service <name> <version> started` log, and `service.isStarted === true`.

Call [`destroy()`](/handbook/api/classes/_purista_core.Service/#destroy) during shutdown. It cancels active streams, stops workers,
destroys a QueueBridge that this service started, and performs base teardown.
That includes a supplied QueueBridge when this service started it. Do not share
one QueueBridge between services that may be destroyed independently unless the
application coordinates their shutdown; otherwise one service can destroy the
bridge still needed by another. The application still owns EventBridge shutdown
and any external resource or adapter lifecycle that it created.

Shutdown order is: stop traffic, destroy every service, destroy EventBridge,
then close application-owned listeners/resources. `destroy()` does not
deregister handlers from EventBridge and does not reset `isStarted`; a service
instance is single-use and cannot be restarted after teardown.

For production bridge/store enablement, follow the specific adapter guide;
installation alone does not wire an adapter into this service.
