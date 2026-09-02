---
title: Choose run, stream, or queued execution
description: Let consumers select aggregate or progressive delivery, and add a PURISTA queue only for admission, retry, or disconnected completion.
order: 394
---

Mounting publishes a target. It does not choose how every consumer receives the
result.

| Consumer need | Framework shape | Harness call |
| --- | --- | --- |
| One result in the current request | Command | `.run(input)` |
| Live status and generated content | Stream | `.stream(input)` |
| Controlled concurrency, retry, or disconnected completion | Queue and worker | Worker calls `.run(input)` or consumes `.stream(input)` |

Both direct forms are address-first:

```ts title="Choose aggregate or streaming delivery"
const outcome = await context.agent.Support['1'].triage_ticket.run(input, {
  sessionId: `ticket:${input.ticketId}`,
})

const execution = await context.agent.Support['1'].triage_ticket.stream(input)
for await (const event of execution) {
  // Map only events promised by this consumer contract.
}
```

The stream is provider-neutral and can be consumed once. Stopping iteration
early cancels remote execution. The terminal `run.finished` event contains the
same outcome shape returned by `.run(...)`.

Provider limits commonly need two controls: Harness admission limits active
runs in one service instance, while a PURISTA queue controls durable arrival,
retry, and fleet-wide worker concurrency. A worker declares the target with
`canInvokeAgent(...)` or `canInvokeWorkflow(...)`. Use
`toHarnessQueueRetry(error)` for retryable provider failures instead of
sleeping in the handler.

Do not add a queue to every agent. A short classification command can call the
target directly when its latency and failure contract permit it.
