# Enterprise billing cycle

This example shows the recommended enterprise interoperability storyline with only default in-memory infrastructure:

1. schedule metadata declares a monthly billing trigger
2. the local runner emits the scheduled event
3. an event-to-queue binding contract describes the handoff
4. a bounded subscription enqueues the long-running queue job
5. the queue worker completes the billing cycle
6. the worker emits a typed result event
7. a result subscription records the completed cycle

Run it from the repository root:

```bash
npm run start -w examples/enterprise-billing-cycle
```

Validate the example:

```bash
npm run test -w examples/enterprise-billing-cycle
```

The queue and event bridge are `DefaultQueueBridge` and `DefaultEventBridge`, so no broker, database, scheduler, or HTTP server is required.

For production scheduling, keep the same contract shape and let an external scheduler own time:

```text
Kubernetes CronJob
  -> trigger container/script
  -> PURISTA billing.monthlyCycleDue event
  -> event-to-queue binding
  -> billing.monthlyClosing queue worker
```

When the queue bridge is Redis or NATS, the event-to-queue binding can use `idempotencyMode: 'strict'` with the existing `billing-cycle:<cycleId>` key. Duplicate event delivery then returns the original queue job id instead of creating another closing job. The default in-memory bridge used by this example stays advisory for local development.
