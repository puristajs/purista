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
