---
title: Deploy workers and scheduled entry points
description: Run queue workers as independently scalable service workloads and let an external scheduler invoke one declared PURISTA target.
order: 1054
---

A queue worker runs inside the service that owns its queue and worker
definitions. A schedule is contract metadata exported for an external
scheduler. PURISTA does not start an in-process production scheduler.

## Create a worker-only entry point

Use the same service aggregate as the monolith, but start only the service and
adapters required by this worker workload. Do not start Hono in a worker image
unless the workload deliberately exposes health/admin HTTP endpoints.

```ts title="src/runtime/invoice-worker.ts"
import { gracefulShutdown, initLogger } from '@purista/core'
import { createEventBridge } from '../eventbridge.js'
import { createQueueBridge } from '../queuebridge.js'
import { createInvoiceRepository } from '../resource/createInvoiceRepository.js'
import { invoiceV1Service } from '../service/invoice/v1/invoiceV1Service.js'

const logger = initLogger()
const eventBridge = await createEventBridge(logger)
await eventBridge.start()
const queueBridge = await createQueueBridge(logger)

const service = await invoiceV1Service.getInstance(eventBridge, {
  logger,
  queueBridge,
  resources: { invoices: await createInvoiceRepository() },
})
await service.start()

gracefulShutdown(logger, [
  {
    name: `${service.serviceInfo.serviceName} ${service.serviceInfo.serviceVersion}`,
    destroy: () => service.destroy(),
  },
  { name: 'Event bridge', destroy: () => eventBridge.destroy() },
])
```

`service.start()` starts/checks the QueueBridge, validates strict capabilities,
then starts workers. `service.destroy()` stops the workers and destroys the
QueueBridge that this service started. Do not share that QueueBridge instance
between independently destroyed services.

Scale worker replicas only when the selected QueueBridge provides the lease,
visibility, acknowledgement, and redelivery behavior the job requires. The
worker must make each external effect idempotent because a crash can cause a
job to be delivered again.

## Export schedules for the platform

Build `purista.definitions.json`, then export a provider-neutral manifest or
Kubernetes CronJobs with the project-local CLI:

```bash title="Export declared schedules"
npm exec purista export schedule-manifest \
  --definitions purista.definitions.json \
  --out schedule-manifest.json
```

The platform entry point authenticates and invokes exactly one declared
command, queue, or event target. Keep business retries in the queue/worker
contract; platform retries can overlap and duplicate a trigger.

For Kubernetes cron schedules, use the explicit trigger image and URL:

```bash title="Export Kubernetes CronJobs"
npm exec purista export kubernetes-cronjob \
  --definitions purista.definitions.json \
  --out kubernetes-cronjobs.json \
  --trigger-image registry.example.com/purista-schedule-trigger:1.0.0 \
  --trigger-url https://scheduler.internal.example/run
```

PURISTA generates JSON only. Your deployment owns the trigger implementation,
identity, network policy, secret injection, enablement, and scheduler-specific
overlap/missed-run behavior.

## Verify the two workloads independently

1. start the worker with the real QueueBridge and prove readiness;
2. enqueue one idempotent test job and observe lease, completion, and result;
3. terminate a worker during execution and verify redelivery/recovery;
4. deploy the scheduler trigger disabled, run one authenticated manual trigger,
   and verify the declared target receives it; and
5. enable the schedule only after duplicate and overlap behavior is understood.

Continue with [export and deploy schedules](/handbook/framework/build-services/schedule-work/export-and-deploy-schedules/)
and [queue delivery adapters](/handbook/framework/connect-distributed-infrastructure/queue-delivery/).
