---
title: Test message flows, queues, and retries
description: Prove idempotency and recovery before enabling retries against a real adapter.
order: 920
---

Test the business rule first, then test the delivery contract. With its default
deterministic bridge mocks, the
[`createQueueWorkerTestHarness`](/handbook/api/functions/_purista_core.createQueueWorkerTestHarness/)
injects one lease and executes one worker cycle through the PURISTA runtime. It
can prove guards, acknowledgement/nack paths, and declared capabilities without
a broker. It does not call `service.start()`.

```ts title="src/service/report/v1/queue-worker/generateReportWorker/generateReportWorkerQueueWorkerBuilder.test.ts"
import { ServiceBuilder, createQueueWorkerTestHarness } from '@purista/core'
import { expect, it } from 'vitest'
import { z } from 'zod'

const reportV1ServiceBuilder = new ServiceBuilder({
  serviceName: 'report',
  serviceVersion: '1',
  serviceDescription: 'generates requested reports',
})

const generateReportQueueBuilder = reportV1ServiceBuilder
  .getQueueBuilder('generateReport', 'report generation jobs')
  .addPayloadSchema(z.object({ reportId: z.string() }))
  .addParameterSchema(z.object({}))

reportV1ServiceBuilder.addQueueDefinition(await generateReportQueueBuilder.getDefinition())
```

[`getQueueBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getqueuebuilder) creates the queue contract; [`addPayloadSchema(schema)`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#addpayloadschema) and [`addParameterSchema(schema)`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#addparameterschema) validate the job values before worker execution. [`addQueueDefinition(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addqueuedefinition) registers the resolved contract on the service builder; it does not start a worker.

```ts title="src/service/report/v1/queue-worker/generateReportWorker/generateReportWorkerQueueWorkerBuilder.test.ts"
const generateReportWorkerQueueWorkerBuilder = reportV1ServiceBuilder
  .getQueueWorkerBuilder('generateReport', 'generates a report')
  .setHandler(async function (context) {
    await context.job.complete({ reportStatus: 'generated' })
    return { status: 'success' }
  })

reportV1ServiceBuilder.addQueueWorkerDefinition(await generateReportWorkerQueueWorkerBuilder.getDefinition())

it('acknowledges a successfully generated report', async () => {
  const harness = await createQueueWorkerTestHarness(reportV1ServiceBuilder, generateReportWorkerQueueWorkerBuilder)

  try {
    const result = await harness.run({
      id: 'report-42',
      queueName: 'generateReport',
      payload: { reportId: 'report-42' },
      parameter: {},
      headers: {},
      createdAt: Date.now(),
      attempt: 1,
      maxAttempts: 3,
      leaseExpiresAt: Date.now() + 60_000,
      leaseTtlMs: 60_000,
      traceId: 'test-trace',
      correlationId: 'test-correlation',
    })

    expect(result.ackCalls).toHaveLength(1)
    expect(result.nackCalls).toHaveLength(0)
  } finally {
    await harness.destroy()
  }
})
```

[`getQueueWorkerBuilder(queueName, workerName)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getqueueworkerbuilder) attaches one worker to that exact queue name, while [`setHandler(handler)`](/handbook/api/classes/_purista_core.QueueWorkerBuilder/#sethandler) installs its job callback. [`addQueueWorkerDefinition(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addqueueworkerdefinition) registers the resolved worker. This separation lets the test vary worker behavior without treating a queue contract as executable by itself.

The helper takes `serviceBuilder`, `workerBuilder`, and optional service-instance
configuration plus `eventBridge` and `queueBridge`. When either bridge is
omitted, it creates and owns that bridge's deterministic mock. The service
builder should include the matching queue definition if its transform,
lifecycle, or result policy is part of the behavior under test. `run(message)`
accepts a complete
[`QueueMessage`](/handbook/api/types/_purista_core.QueueMessage/) and,
with owned mocks, returns the captured acknowledgement, negative
acknowledgement, dead-letter, and lease-extension calls. Always call
`destroy()` in `finally`; it destroys the service and only the mocks owned by
the helper.

Add a separate deterministic test for the retryable and terminal branches. The
harness proves runtime behavior at the Framework boundary; it cannot prove a
Redis/NATS lease expiry, broker ACL, or actual DLQ persistence. When you supply
a real QueueBridge, `harness.run()` does not inject the given lease or return
mock call traces; the supplied bridge remains test-owned. Use an adapter
integration test for that boundary.

## Prove the promise at the right boundary

| Claim | Direct handler test | Deterministic Framework runtime | Adapter integration test |
| --- | --- | --- | --- |
| Successful job is acknowledged | [`createQueueWorkerContextMock`](/handbook/api/functions/_purista_core.createQueueWorkerContextMock/) lets the handler assert `context.job.complete(...)`. | Worker harness sees one `ack` call after the worker lifecycle settles the lease. | Job survives a real enqueue, lease, and acknowledgement cycle. |
| Transient failure retries | Assert the handler returns or requests the intended retry decision. | Harness sees retry or terminal settlement for the configured message attempt/window path. | Lease, redelivery, and delay follow the adapter configuration. |
| Permanent failure is isolated | Assert the handler requests an explicit fatal failure where that is the business rule. | Harness sees the dead-letter decision. | DLQ can be inspected and boundedly redriven. |
| Duplicate job causes one effect | Test the business-key branch with two controlled messages. | Test the service's settlement and event/result behavior with the owned mocks. | The adapter returns the original job ID for the same idempotency key where it supports that contract. |

The direct context helper takes the worker builder and a `queueName` and
`payload`, with optional `parameter`, Sinon `sandbox`, declared `resources`,
and message-field overrides. It returns a typed `context`, generated `message`,
and controllable job/store/event/client stubs. It does not run worker guards,
lease settlement, or a QueueBridge.

Use a stable idempotency key in the test. Assert that two enqueues with that key
result in one business effect. Then run the adapter's maintained integration
test or a protected test environment to verify its lease, redelivery, delayed
delivery, and dead-letter behavior.

Core retries a thrown worker failure until the message reaches its configured
`maxAttempts` or retry-window limit, then moves it to the resolved dead-letter
queue and acknowledges the lease. The default lifecycle is ten attempts, a
24-hour retry window, exponential jittered delay, a 15-minute visibility lease,
and automatic heartbeats. Configure and test a different policy in
[leases, retries, idempotency, and dead letters](/handbook/framework/build-services/queues-and-workers/configure-leases-retries-idempotency-and-dead-letters/).

Do not make an assertion about exactly-once processing unless the whole business effect—not only the queue publish—is protected by an implemented idempotency/reconciliation strategy.

Next: [chapter overview](/handbook/framework/test-applications/).
