---
title: Expose queued work
description: Accept a request through an async command, return a durable job handle, and keep HTTP topology and result retrieval at their proper boundaries.
order: 357
---

Queues and workers do not expose HTTP routes. To accept web work, expose a
**command** that declares `canEnqueue(...)` and returns the `QueueEnqueueResult`
from its queue submission. Hono projects that async command as `202 Accepted`.

```ts title="src/service/report/v1/command/requestReport.ts"
export const requestReportCommandBuilder = reportV1ServiceBuilder
  .getCommandBuilder('requestReport', 'Accept report generation')
  .addPayloadSchema(requestReportPayloadSchema)
  .addOutputSchema(reportAcceptedSchema)
  .canEnqueue('generateReport', reportJobPayloadSchema)
  .exposeAsHttpEndpoint(
    'POST',
    'reports',
    'application/json',
    'utf-8',
    'application/json',
    'utf-8',
    { mode: 'async' },
  )
  .setCommandFunction(async function (context, payload) {
    const job = await context.queue.enqueue.generateReport(payload, undefined, {
      idempotencyKey: `report:${payload.reportId}`,
    })
    return job
  })
```

The chain has two separate contracts.
[`getCommandBuilder(name, description, successEventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder)
creates the command boundary; `name` must be non-empty, `description` explains
the operation in the generated definition, and the optional third argument is
a command success-event name—not the queue result event. Register the finished
command with [`addCommandDefinition(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addcommanddefinition)
before the service resolves definitions. Then
[`addPayloadSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema),
and [`addOutputSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema)
define the HTTP-facing command input and accepted-result shape.
[`canEnqueue(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canenqueue)
declares the queue client that the handler may use; it requires a non-empty
queue name and optional queue payload/parameter schemas. Finally,
[`exposeAsHttpEndpoint(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#exposeashttpendpoint)
with `{ mode: 'async' }` asks Hono to accept only a returned queue receipt as
`202`; it never makes the queue worker synchronous. The service-bound
[`setCommandFunction(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction)
must return that receipt unchanged.

`mode` defaults to `sync`. Use `async` only for a command whose observable
outcome is acceptance: Hono rejects a different handler result with `500`
rather than guessing a job identity. The full HTTP method/path/media options,
security metadata, and OpenAPI choices are in [Expose a command](/handbook/framework/build-services/commands/expose-a-command/).

## Return an acceptance contract, not the eventual result

The async command must return a valid queue enqueue result. Hono maps it to a
`202` response containing `jobId`, `queueName`, and—where available—scheduled
time or run metadata. A queue definition cannot be projected directly, and the
worker never runs synchronously for that HTTP request.

Give clients a deliberate next step:

- persist a business-keyed status/result that they can retrieve; or
- publish a result event that an application-specific client channel consumes.

Do not tell clients to blindly repeat the creation request to find out whether
work finished. An idempotency key helps duplicate acceptance only when the
selected bridge supports it; the result contract remains an application design.

The command page owns `exposeAsHttpEndpoint(...)`. Hono topology, discovery
startup order, monolith mode, authentication, OpenAPI, and error mapping remain
in [HTTP runtime architecture](/handbook/framework/expose-and-consume-services/http-and-rest/runtime-architecture/).
