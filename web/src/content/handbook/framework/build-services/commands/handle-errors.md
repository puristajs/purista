---
title: Handle command errors
description: Keep invalid input, expected business rejection, and unexpected failure distinct so callers and operators receive the right signal.
order: 323
---

Command error handling starts with the contract. Let schema validation reject malformed input before the handler runs. Throw `HandledError` only for an expected business result that is safe to share. Let bugs and unavailable dependencies remain unexpected so the runtime, logs, and traces can show the real failure.

## Classify the outcome

| Situation | What to do | What must not happen |
| --- | --- | --- |
| Payload or parameter has the wrong shape | Let the declared schemas reject it. | Duplicate validation manually in the handler. |
| A known business rule prevents the action | Throw a `HandledError`. | Return a fake success or leak internal details. |
| A dependency is unavailable or an invariant is broken | Let the error propagate. | Convert it into a caller-facing domain message. |
| The handler returns an invalid result | Fix the implementation/output contract. | Continue to after guards or publish success. |

## Return a safe business rejection

`HandledError` has the positional form `new HandledError(statusCode, message?, data?, traceId?)`. The message and data cross the command boundary, so keep them stable and safe for callers. A trace ID helps correlate the controlled result with logs and tracing.

```ts title="src/service/invoice/v1/command/cancelInvoice/cancelInvoiceCommandBuilder.ts"
import { HandledError, StatusCode } from '@purista/core'

export const cancelInvoiceCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('cancelInvoice', 'Cancel an invoice')
  .addPayloadSchema(cancelInvoicePayloadSchema)
  .addParameterSchema(cancelInvoiceParameterSchema)
  .addOutputSchema(cancelInvoiceOutputSchema)
  .setCommandFunction(async function (context, payload) {
    const invoice = await context.resources.invoices.find(payload.invoiceId)
    if (invoice.status === 'paid') {
      throw new HandledError(StatusCode.Conflict, 'A paid invoice cannot be cancelled')
    }
    return context.resources.invoices.cancel(invoice.id)
  })
```

Never put a database error, upstream response, credential, raw request body, or stack trace in `message` or `data`.

The local command remains [`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder) plus [`addPayloadSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema), [`addParameterSchema(schema)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema), [`addOutputSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema), and [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction). Input schema failures bypass the handler; an output-schema failure is unexpected and bypasses success response creation. The definition guide explains representation defaults and the service-bound handler contract.

## Keep recovery at the owning boundary

Commands are request-response operations. [`adviceAutoacknowledgeMessages(acknowledge = true)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#adviceautoacknowledgemessages)
supplies delivery advice to the EventBridge; its default is `true`. Setting it
to `false` does not create command-local retry or exactly-once delivery—provider
support and response delivery decide whether redelivery is possible.

For a business conflict, return the known result now. For durable retry, dead-lettering, or backoff, move the work to a [queue and worker](/handbook/framework/build-services/queues-and-workers/) or use a [subscription delivery policy](/handbook/framework/build-services/subscriptions/). Make an external side effect idempotent before allowing any retry path.

[`markSchedulable(options)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#markschedulable)
attaches command schedule metadata; it does not run a scheduler. Its defaults
are `concurrencyPolicy: 'allow'`, `missedRunPolicy: 'skip'`, and
`enabledByDefault: true`. The options also own the expression/time zone,
catch-up count, jitter, idempotency key, target schemas, and provider hints;
choose and deploy them in [Schedule work](/handbook/framework/build-services/schedule-event-queue-result/).
[`markAsDeprecated()`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#markasdeprecated)
is metadata only; retain the working implementation until callers have a
documented replacement.

Next, [publish the success event](/handbook/framework/build-services/commands/publish-success-event/) or [test a command](/handbook/framework/build-services/commands/test-a-command/).

For the API signatures, see [CommandDefinitionBuilder](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/).
