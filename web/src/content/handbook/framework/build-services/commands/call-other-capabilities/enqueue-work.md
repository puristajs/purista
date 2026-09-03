---
title: Enqueue background work
description: Declare a queue, enqueue or schedule accepted work from a command, and keep acceptance separate from worker completion.
order: 325
---

Use a queue when the command should accept durable work rather than wait for it to finish. Typical cases are report generation, notifications, imports, and calls with a long or unreliable external dependency.

## Declare and enqueue work

```ts title="src/service/invoice/v1/command/updateInvoice/updateInvoiceCommandBuilder.ts"
export const updateInvoiceCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('updateInvoice', 'Update an invoice')
  .canEnqueue('invoiceNotification', invoiceNotificationPayloadSchema)
  .addPayloadSchema(updateInvoicePayloadSchema)
  .addParameterSchema(updateInvoiceParameterSchema)
  .addOutputSchema(updateInvoiceOutputSchema)
  .setCommandFunction(async function (context, payload, parameter) {
    const invoice = await context.resources.invoices.update(parameter.invoiceId, payload)
    if (!invoice) throw new HandledError(StatusCode.NotFound, 'Invoice does not exist')

    if (parameter.notify) {
      await context.queue.enqueue.invoiceNotification(
        { invoiceId: invoice.invoiceId },
        {},
        { idempotencyKey: `invoice-updated:${invoice.invoiceId}:${invoice.updatedAt}` },
      )
    }

    return invoice
  })
```

`getCommandBuilder(...)` creates the local request boundary; the
[`add…Schema(...)` methods](/handbook/framework/build-services/commands/create-and-validate/#understand-the-builder-methods)
remain the command's own validated contract; and
[`setCommandFunction(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction)
installs the service-bound handler. `canEnqueue(...)` is the additional
declaration on this page: it grants that handler a typed queue client for the
named target. The complete local command setup is in [Create and validate a
command](/handbook/framework/build-services/commands/create-and-validate/).

The local command calls are [`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder), [`addPayloadSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema), [`addParameterSchema(schema)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema), [`addOutputSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema), and [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction). They own the accepted request and command response; they do not create the target queue. Register that queue and its worker independently.

[`canEnqueue(queueName, payloadSchema?, parameterSchema?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canenqueue) requires a non-empty queue name. The queue must also be configured on the service; an undeclared queue is forbidden and an absent service queue is not found.

Those two conditions are internal capability/configuration errors. The internal
`UnhandledError` carries `403` for a queue not allowed in this handler or `404`
for a queue not registered in the service, but an external command caller sees
a generic `500`. Fix the declaration/registration instead of treating either
case as a caller authorization or missing-resource response.

## Choose enqueue options deliberately

| Option | Purpose |
| --- | --- |
| `delayMs` | Delay eligibility for execution. |
| `idempotencyKey` | Let the queue/provider deduplicate compatible repeated acceptance attempts. It does not make external work exactly once. |
| `headers` | Safe, non-sensitive job metadata. |
| `maxAttempts` | Override the queue lifecycle default for this job. |
| `priority` | Request relative scheduling priority where the bridge supports it. |
| `leaseTtlMs` | Override the job lease duration where supported. |

You can schedule accepted work with `context.queue.scheduleAt.invoiceNotification(runAt, payload, parameter?, options?)`. Validate the time and use a stable idempotency key when duplicate scheduling would be harmful.

The awaited `QueueEnqueueResult` proves acceptance only. This command discards
the receipt because its caller needs the invoice result; an async HTTP producer
can return the receipt unchanged when the caller needs a job ID. Queue
acceptance is not worker completion, and the resource write plus enqueue is not
atomic. See [Queues and workers](/handbook/framework/build-services/queues-and-workers/) for worker lifecycle, retries, and dead letters.

Next: [Expose a command](/handbook/framework/build-services/commands/expose-a-command/) if an HTTP caller should receive job acceptance.

For the exact declaration signature, see [`canEnqueue`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canenqueue).
