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

Use `defineHarnessQueueBinding(...)` when the queue is the published target's
delivery mode. It composes native queue and worker builders and keeps the
Harness contract as the only input/output schema owner:

```ts title="Bind optional durable delivery"
const queuedTriage = defineHarnessQueueBinding(
  supportHarness.contracts.agents.triage_ticket,
  supportV1ServiceBuilder
    .getQueueBuilder('support.triage', 'Queue ticket triage')
    .setLifecycleConfig({ maxAttempts: 5 }),
  supportV1ServiceBuilder
    .getQueueWorkerBuilder('support.triage', 'triage-worker')
    .setMaxParallelHandlers(3),
)

export const supportV1Service = supportV1ServiceBuilder.mountHarness(supportHarness, {
  publish: { agents: ['triage_ticket'] },
  targets: { agents: { triage_ticket: { queue: queuedTriage } } },
})
```

[`getQueueBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getqueuebuilder)
declares the queue contract, and
[`setLifecycleConfig(config)`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#setlifecycleconfig)
sets delivery rules such as `maxAttempts`.
[`getQueueWorkerBuilder(queueName, workerName)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getqueueworkerbuilder)
creates the worker definition, while
[`setMaxParallelHandlers(count)`](/handbook/api/classes/_purista_core.QueueWorkerBuilder/#setmaxparallelhandlers)
bounds concurrent executions in this worker instance. These declarations do
not replace the QueueBridge or a provider-level rate limit.

Declare `queuedTriage.contract` at a caller to receive typed queue delivery:

```ts title="Declare queued agent delivery"
const classifyCommandBuilder = supportV1ServiceBuilder
  .getCommandBuilder('classifyTicket', 'Queue ticket classification')
  .canInvokeAgent('Support', '1', 'triage_ticket', queuedTriage.contract)
  .setCommandFunction(async function ({ agent }, input) {
    return agent.Support['1'].triage_ticket.enqueue(
      input,
      { sessionId: `ticket:${input.ticketId}` },
      { idempotencyKey: `triage:${input.ticketId}` },
    )
  })
```

[`mountHarness(definition, policy)`](/handbook/api/classes/_purista_core.ServiceBuilder/#mountharness)
publishes the selected target and owns its queue worker.
[`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder)
creates the addressable command contract, and
[`canInvokeAgent(service, version, target, contract)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#caninvokeagent)
declares the EventBridge address and exposes `.enqueue(...)` only for the
wrapped queued contract.
[`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction)
installs the command handler after its invocation capabilities are declared.

The queue worker still calls the published service address through EventBridge.
Tenant and principal identity come from trusted queue metadata. A caller that
declares the plain Harness contract has only `.run(...)` and `.stream(...)`.

Do not add a queue to every agent. A short classification command can call the
target directly when its latency and failure contract permit it.
