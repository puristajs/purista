---
title: Publish the success event
description: Name the canonical successful command response so subscriptions can react without coupling the command to their work.
order: 324
---

Use a command output for the caller that needs the value now. Add a named success event when other components should react after the command succeeds. Name it as a completed fact, such as `invoice.created` or `claim.approved`.

## Name the successful response

```ts title="src/service/invoice/v1/command/createInvoice/createInvoiceCommandBuilder.ts"
export const createInvoiceCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('createInvoice', 'Create an invoice')
  .addPayloadSchema(createInvoicePayloadSchema)
  .addParameterSchema(createInvoiceParameterSchema)
  .addOutputSchema(createInvoiceOutputSchema)
  .setSuccessEventName('invoice.created')
  .setCommandFunction(async function (context, payload) {
    return context.resources.invoices.create(payload)
  })
```

[`setSuccessEventName(eventName)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setsuccesseventname) requires a non-empty string at the type level. After the handler, output validation, after guards, and optional output transform succeed, PURISTA creates a command success response containing this event name. The EventBridge delivers the response; matching subscriptions can react to it.

[`addPayloadSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema), [`addParameterSchema(schema)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema), and [`addOutputSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema) still define the command’s local contract. [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) must complete with a valid output before PURISTA can attach the configured event name. The two optional media arguments on payload/output schemas retain prior values or resolve to the definition’s JSON/UTF-8 defaults; they do not change event delivery semantics.

## Choose where to name the event

The optional third argument of
[`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder)
and [`setSuccessEventName(eventName)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setsuccesseventname)
configure the same success-response metadata. Both require a non-empty event
name; if both are used, the later setter supplies the final name.

| Style | Use it when | Example |
| --- | --- | --- |
| Name at builder creation | The success fact is part of the command's stable identity and is known before any optional configuration. | `getCommandBuilder('createInvoice', 'Create an invoice', 'invoice.created')` |
| Set it in the fluent chain | The definition groups outcome settings together, or a generated starter already uses this style. | `.setSuccessEventName('invoice.created')` |

Choose one style consistently in a service. Neither form emits a custom event
from the handler or waits for subscription completion.

## Choose a success event or a custom event

| You need | Use | Why |
| --- | --- | --- |
| One canonical fact that the command completed successfully | [`setSuccessEventName(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setsuccesseventname) | It is attached to the successful command response. |
| Another distinct fact while the handler runs | [`canEmit(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canemit) and `context.emit(...)` | It has its own event name and payload schema. |
| A reliable database-and-broker commit | An outbox or reconciliation design | Neither event mechanism creates a cross-system transaction. |

Do not use the success event for “handler started,” and do not assume a subscriber has completed when the command response arrives. Put subscriber-specific work in [Subscriptions](/handbook/framework/build-services/subscriptions/), and design recovery for the EventBridge adapter you operate.

Next: [Emit custom events](/handbook/framework/build-services/commands/call-other-capabilities/emit-custom-events/) or [Handle command errors](/handbook/framework/build-services/commands/handle-errors/).

For the exact signature, see [`setSuccessEventName`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setsuccesseventname).
