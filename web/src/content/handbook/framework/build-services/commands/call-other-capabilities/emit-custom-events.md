---
title: Emit custom events
description: Declare and publish a distinct domain fact from a command without confusing it with the command’s canonical success event.
order: 328
---

Use `canEmit(...)` for a fact that is distinct from the command’s own successful response. For example, `invoice.credit-limit-exceeded` may be meaningful even though the command returns a conflict; `invoice.created` is normally the command’s canonical success event instead.

## Declare the event before emitting it

```ts title="src/service/invoice/v1/command/flagInvoice/flagInvoiceCommandBuilder.ts"
export const flagInvoiceCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('flagInvoice', 'Flag an invoice for review')
  .canEmit('invoice.flagged', invoiceFlaggedEventSchema)
  .addPayloadSchema(flagInvoicePayloadSchema)
  .addParameterSchema(flagInvoiceParameterSchema)
  .addOutputSchema(flagInvoiceOutputSchema)
  .setCommandFunction(async function (context, payload) {
    const invoice = await context.resources.invoices.flag(payload.invoiceId)
    await context.emit('invoice.flagged', { invoiceId: invoice.id, reason: payload.reason })
    return { invoiceId: invoice.id }
  })
```

`getCommandBuilder(...)` and the
[`add…Schema(...)` methods](/handbook/framework/build-services/commands/create-and-validate/#know-what-each-definition-method-does)
declare the local command contract; [`setCommandFunction(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction)
installs the service-bound handler. `canEmit(...)` is the additional
capability: it gives that handler an emitter restricted to the named event and
its schema. Read [Create and validate a command](/handbook/framework/build-services/commands/create-and-validate/)
for the local validation and handler lifecycle.

The local definition uses [`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder), [`addPayloadSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema), [`addParameterSchema(schema)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema), and [`addOutputSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema). [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) must be a non-arrow function and is the only place the declared emitter becomes available. Those schemas remain the command contract; `invoiceFlaggedEventSchema` is the separate event contract.

[`canEmit(eventName, schema)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canemit) requires a non-empty name and records the payload contract. `context.emit(eventName, payload, contentType?, contentEncoding?)` validates the payload before asking the EventBridge to emit it. The media defaults are `application/json` and `utf-8`.

## Do not confuse the two event forms

| Event form | Configure it with | Use it for |
| --- | --- | --- |
| Command success event | [`setSuccessEventName(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setsuccesseventname) | The one canonical fact that the complete command succeeded. |
| Custom event | [`canEmit(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canemit) and `context.emit(...)` | An additional, independently meaningful fact. |

Event emission is an awaited transport action, but it is not a transaction with a database/resource write. If both must survive together, use an outbox or reconciliation design. Continue with [Subscriptions](/handbook/framework/build-services/subscriptions/) to react to the event.

For the exact signature, see [`canEmit`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canemit).
