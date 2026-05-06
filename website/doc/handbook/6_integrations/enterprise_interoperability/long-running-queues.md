---
title: Long-running queues
description: Configure queue leases, heartbeats, and retry boundaries for long-running work.
order: 610030
---

# Long-running queues

Long-running backend work belongs to queue workers. A long-running queue acknowledges after terminal success and keeps ownership alive with heartbeats and lease extensions.

```ts
const queue = service
  .getQueueBuilder('billing.monthlyClosing', 'Close a monthly billing cycle')
  .addPayloadSchema(billingClosingQueuePayloadSchema)
  .addParameterSchema(billingClosingQueueParameterSchema)
  .setExecutionProfile('longRunning', {
    maxRuntimeMs: 6 * 60 * 60_000,
  })
```

The long-running profile is a safer shorthand over lifecycle settings:

- five minute visibility timeout
- one minute heartbeat
- automatic lease extension
- derived max lease extensions from `maxRuntimeMs`
- bounded attempts and retry window
- graceful shutdown policy that lets unsettled leases expire

Handlers must still be idempotent. PURISTA provides at-least-once execution, not exactly-once execution.

Bridge limitations matter:

- `DefaultQueueBridge` supports leases and lease extension in-memory, but jobs and leases are lost on process restart.
- Redis and NATS queue bridges persist jobs, support lease recovery, and are the better fit for production long-running jobs.
- `strict: true` on the long-running profile fails startup when the selected queue bridge cannot advertise the required capability.
- `idempotencyEnforcement` is currently `false` for the shipped queue bridges, so strict transport-level dedupe is not promised in v1.

For lower-level tuning, see [Queue internals & delivery tuning](../../2_building_business-logic/advanced/queues.md).
