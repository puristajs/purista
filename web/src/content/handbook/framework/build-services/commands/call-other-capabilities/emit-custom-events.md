---
title: Emit custom events
description: Publish an additional domain fact from updateInvoice and understand how its timing differs from the named success response.
order: 324
---

Use `canEmit(...)` for a fact that is distinct from the command’s own successful response. For example, an update can publish `invoice.review-requested` when a large due-date extension needs independent follow-up; `invoice.updated` remains the canonical success response event.

## Declare the event before emitting it

```ts title="src/service/invoice/v1/command/updateInvoice/updateInvoiceCommandBuilder.ts"
export const updateInvoiceCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('updateInvoice', 'Update an invoice')
  .canEmit('invoice.review-requested', invoiceReviewRequestedEventSchema)
  .addPayloadSchema(updateInvoicePayloadSchema)
  .addParameterSchema(updateInvoiceParameterSchema)
  .addOutputSchema(updateInvoiceOutputSchema)
  .setSuccessEventName('invoice.updated')
  .setCommandFunction(async function (context, payload, parameter) {
    const invoice = await context.resources.invoices.update(parameter.invoiceId, payload)
    if (!invoice) throw new HandledError(StatusCode.NotFound, 'Invoice does not exist')

    if (requiresReview(invoice)) {
      await context.emit('invoice.review-requested', { invoiceId: invoice.invoiceId })
    }

    return invoice
  })
```

`getCommandBuilder(...)` and the
[`add…Schema(...)` methods](/handbook/framework/build-services/commands/create-and-validate/#understand-the-builder-methods)
declare the local command contract; [`setCommandFunction(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction)
installs the service-bound handler. `canEmit(...)` is the additional
capability: it gives that handler an emitter restricted to the named event and
its schema. Read [Create and validate a command](/handbook/framework/build-services/commands/create-and-validate/)
for the local validation and handler lifecycle.

The local definition uses [`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder), [`addPayloadSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema), [`addParameterSchema(schema)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema), and [`addOutputSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema). [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) must be a non-arrow function and is where the declared emitter becomes available. Those schemas remain the command contract; `invoiceReviewRequestedEventSchema` is the separate event contract.

[`canEmit(eventName, schema)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canemit) requires a non-empty name and records the payload contract. `context.emit(eventName, payload, contentType?, contentEncoding?)` validates the payload before asking the EventBridge to emit it. The media defaults are `application/json` and `utf-8`.

An invalid emitted payload or a missing registered event schema is an
application defect. It aborts the command with an `UnhandledError(500)`; the
caller receives a generic internal error rather than event-schema issues.

Verify the declared interaction in a direct handler test:

```ts title="src/service/invoice/v1/command/updateInvoice/updateInvoiceCommandBuilder.test.ts"
const { context, stubs } = createCommandContextMock(updateInvoiceCommandBuilder, {
  payload,
  parameter,
  resources,
})

await safeBind(updateInvoiceCommandBuilder.getCommandFunction(), service)(context, payload, parameter)
expect(stubs.emit['invoice.review-requested'].calledOnce).toBe(true)
```

The stub proves the handler requested the declared event with a valid payload;
an adapter integration test must separately prove broker delivery.

## Do not confuse the two event forms

| Event form | Configure it with | Use it for |
| --- | --- | --- |
| Command success event | [`setSuccessEventName(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setsuccesseventname) | The one canonical fact that every command stage completed. It is attached to the response returned to the caller. |
| Custom event | [`canEmit(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canemit) and `context.emit(...)` | An additional fact emitted at a deliberate point inside the handler. |

Event emission is an awaited transport action, but subscriber completion is not awaited. A custom event can already have been emitted when later handler code or output validation fails; the named success event cannot. Neither form is a transaction with a database/resource write. If the write and event must survive together, use an outbox or reconciliation design.

Continue with [Subscriptions](/handbook/framework/build-services/subscriptions/) to react to either event, or [enqueue background work](/handbook/framework/build-services/commands/call-other-capabilities/enqueue-work/) when execution needs queue durability, retries, or dead letters.

For the exact signature, see [`canEmit`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canemit).
