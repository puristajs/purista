---
title: Invoke another command
description: Declare a synchronous command dependency, validate its narrow contract, and await its result only when the current outcome needs it.
order: 326
---

Invoke another command only when this command cannot decide its own outcome without the downstream answer. A success event or queue is usually a better boundary when the current caller does not need that answer now.

## Declare and await the dependency

```ts title="src/service/invoice/v1/command/createInvoice/createInvoiceCommandBuilder.ts"
export const createInvoiceCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('createInvoice', 'Create an invoice')
  .canInvoke(
    'Customer',
    '1',
    'getCreditStatus',
    creditStatusOutputSchema,
    creditStatusPayloadSchema,
    creditStatusParameterSchema,
  )
  .addPayloadSchema(createInvoicePayloadSchema)
  .addParameterSchema(createInvoiceParameterSchema)
  .addOutputSchema(createInvoiceOutputSchema)
  .setCommandFunction(async function (context, payload) {
    const credit = await context.service.Customer[1].getCreditStatus(
      { customerId: payload.customerId },
      {},
    )
    if (!credit.allowed) throw new HandledError(StatusCode.Conflict, 'Credit is not available')
    return context.resources.invoices.create(payload)
  })
```

`getCommandBuilder(...)` names the local operation; the three
[`add…Schema(...)` calls](/handbook/framework/build-services/commands/create-and-validate/#know-what-each-definition-method-does)
define its own input and result independently of the downstream contract; and
[`setCommandFunction(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction)
installs the service-bound handler. This page adds only the declared
cross-service dependency. Use [Create and validate a command](/handbook/framework/build-services/commands/create-and-validate/)
when those local schemas or handler semantics need changing.

The exact local calls are [`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder), [`addPayloadSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema), [`addParameterSchema(schema)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema), and [`addOutputSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema). They validate the caller-facing contract; they do not validate the remote operation. [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) is required before the definition can be registered and must be a non-arrow function so PURISTA can bind the service receiver.

## Understand [`canInvoke(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#caninvoke)

| Argument | Required | Meaning |
| --- | --- | --- |
| `serviceName` | Yes | Downstream service name. |
| `serviceVersion` | Yes | Downstream service version. |
| `serviceTarget` | Yes | Downstream command name. |
| `outputSchema` | No | Validates and types the downstream response. |
| `payloadSchema` | No | Validates and types the downstream request payload. |
| `parameterSchema` | No | Validates and types the downstream request parameter. |

All three address parts must be non-empty. The runtime propagates trace, principal, and tenant data. A target failure, timeout, or unavailable transport fails this command too; decide timeout and retry behavior at the client or bridge boundary.

Use the smallest downstream output schema that lets this command decide. Do not expose a repository-shaped response merely because the other service has one.

Next: [Enqueue background work](/handbook/framework/build-services/commands/call-other-capabilities/enqueue-work/) when the answer is not needed now.

For the exact signature, see [`canInvoke`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#caninvoke).
