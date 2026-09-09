---
title: Choose run, stream, or queued execution
description: Choose aggregate, progressive, or durable delivery for each mounted Harness target.
order: 394
---

Mounting gives an agent or workflow a service address. The caller chooses how
to receive the work.

| Consumer need | Framework shape | Harness client |
| --- | --- | --- |
| One result in the current request | Command | `.run(input, options?)` |
| Live status and generated content | Stream | `.stream(input, options?)` |
| Admission, retry, or disconnected completion | Queue and worker | `.enqueue(input, options?, metadata?)` |

Aggregate and streaming calls use the same declared target:

```ts title="Choose aggregate or streaming delivery"
const triage = context.agent.Support['1'][triageTicketAgent.contract.id]
const result = await triage.run(input, {
  sessionId: `ticket:${input.ticketId}`,
})

if (result.outcome.status === 'completed') {
  console.log(result.outcome.output)
}

const execution = await triage.stream(input, {
  sessionId: `ticket:${input.ticketId}`,
})
for await (const event of execution) {
  // Map only events promised by this consumer contract.
}
```

`.run(...)` returns `{ sessionId, outcome }`. The outcome is either a completed
value or an interruption that the application can resume. `.stream(...)`
returns a cancellable stream with its `sessionId`. Its terminal `run.finished`
event carries the same outcome shape. Cancelling or stopping early must cancel
the upstream execution.

Use `defineHarnessQueueBinding(...)` when one mounted target needs durable
delivery:

```ts title="Bind optional durable delivery"
const queuedTriage = defineHarnessQueueBinding(
  triageTicketAgent.contract,
  supportV1ServiceBuilder
    .getQueueBuilder('support.triage', 'Queue ticket triage')
    .setLifecycleConfig({ maxAttempts: 5 }),
  supportV1ServiceBuilder
    .getQueueWorkerBuilder('support.triage', 'triage-worker')
    .setMaxParallelHandlers(3),
)

export const supportV1Service = supportV1ServiceBuilder.mountHarness(supportHarness, {
  targets: { agents: { [triageTicketAgent.contract.id]: { queue: queuedTriage } } },
})
```

[`mountHarness(definition, policy)`](/handbook/api/classes/_purista_core.ServiceBuilder/#mountharness)
attaches the queue binding to this target.

The caller declares the queued reference instead of the plain agent contract:

```ts title="Declare queued agent delivery"
const classifyCommandBuilder = supportV1ServiceBuilder
  .getCommandBuilder('classifyTicket', 'Queue ticket classification')
  .canInvokeAgent('Support', '1', queuedTriage.reference)
  .setCommandFunction(async function ({ agent }, input) {
    return agent.Support['1'][queuedTriage.reference.contract.id].enqueue(
      input,
      { sessionId: `ticket:${input.ticketId}` },
      { idempotencyKey: `triage:${input.ticketId}` },
    )
  })
```

[`canInvokeAgent(service, version, contract)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#caninvokeagent)
uses the queued reference to expose `.enqueue(...)` on the declared target.

Enqueue returns an acceptance envelope with identifiers such as `jobId`,
`queueName`, and `sessionId`. It does not return the agent's final output.

[`getQueueBuilder(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getqueuebuilder)
defines delivery rules, and
[`getQueueWorkerBuilder(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getqueueworkerbuilder)
defines worker concurrency. The QueueBridge provides durable transport. Model
admission separately limits active provider calls inside a service instance.
