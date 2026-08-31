---
title: Publish the success event
description: Mark the updateInvoice response as a fact so the caller receives its result while independent subscriptions may also react.
order: 323
---

Use a command output for the caller that needs the value now. Add a named
success event when other components may also react after every command stage
succeeds. Name it as a completed fact, such as `invoice.updated` or
`claim.approved`.

## Name the successful response

```ts title="src/service/invoice/v1/command/updateInvoice/updateInvoiceCommandBuilder.ts"
export const updateInvoiceCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('updateInvoice', 'Update an invoice')
  .addPayloadSchema(updateInvoicePayloadSchema)
  .addParameterSchema(updateInvoiceParameterSchema)
  .addOutputSchema(updateInvoiceOutputSchema)
  .setSuccessEventName('invoice.updated')
  .setCommandFunction(async function (context, payload, parameter) {
    const invoice = await context.resources.invoices.update(parameter.invoiceId, payload)
    if (!invoice) throw new HandledError(StatusCode.NotFound, 'Invoice does not exist')
    return invoice
  })
```

[`setSuccessEventName(eventName)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setsuccesseventname) requires a non-empty string at the type level. PURISTA creates the named success response only after the handler returns, the domain output schema validates, after guards succeed, and any output transform plus transformed-output schema succeeds. The EventBridge uses that response to resolve the caller and to match subscriptions. Subscriber completion is not part of the caller's response.

[`addPayloadSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema), [`addParameterSchema(schema)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema), and [`addOutputSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema) still define the command’s local contract. [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) must complete with a valid output before PURISTA can attach the configured event name. The two optional media arguments on payload/output schemas retain prior values or resolve to the definition’s JSON/UTF-8 defaults; they do not change event delivery semantics.

## Choose where to name the event

The optional third argument of
[`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder)
and [`setSuccessEventName(eventName)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setsuccesseventname)
configure the same success-response metadata. Both require a non-empty event
name; if both are used, the later setter supplies the final name.

| Style | Use it when | Example |
| --- | --- | --- |
| Name at builder creation | The success fact is part of the command's stable identity and is known before optional configuration. | `getCommandBuilder('updateInvoice', 'Update an invoice', 'invoice.updated')` |
| Set it in the fluent chain | Outcome metadata is grouped beside the output contract. | `.setSuccessEventName('invoice.updated')` |

Choose one style consistently in a service. Neither form emits a custom event
from the handler or waits for subscription completion.

## Choose a success event or a custom event

| You need | Use | Why |
| --- | --- | --- |
| One canonical fact that the command completed successfully | [`setSuccessEventName(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setsuccesseventname) | It is attached to the successful command response. |
| Another distinct fact while the handler runs | [`canEmit(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canemit) and `context.emit(...)` | It has its own event name and payload schema. |
| A reliable database-and-broker commit | An outbox or reconciliation design | Neither event mechanism creates a cross-system transaction. |

Do not use the success event for “handler started,” and do not assume a subscriber has completed when the command response arrives. No success event is produced after input failure, a guard rejection, a thrown handler error, invalid output, or output-transform failure. Put subscriber-specific work in [Subscriptions](/handbook/framework/build-services/subscriptions/), and design recovery for the EventBridge adapter you operate.

Next: [Emit custom events](/handbook/framework/build-services/commands/call-other-capabilities/emit-custom-events/) or [Handle command errors](/handbook/framework/build-services/commands/handle-errors/).

For the exact signature, see [`setSuccessEventName`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setsuccesseventname).
