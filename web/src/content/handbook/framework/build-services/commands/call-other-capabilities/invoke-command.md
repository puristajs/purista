---
title: Invoke another command
description: Add one typed synchronous dependency to updateInvoice, validate only the data it needs, and understand the resulting coupling.
order: 322
---

Invoke another command when the current command cannot decide its response
without a downstream result. `updateInvoice`, for example, can ask a policy
service whether the requested due-date change is allowed before writing it.

This creates synchronous latency and availability coupling: if the policy
command fails, times out, or returns an invalid result, `updateInvoice` fails as
well. Use an event or queue when the current response does not need that answer.

## 1. Define the consumer-local contract

The policy service may return a larger object. This command needs only the
decision and the maximum allowed date, so it owns a smaller response schema.

```ts title="src/service/invoice/v1/command/updateInvoice/updatePolicySchemas.ts"
import { z } from 'zod'

export const updatePolicyPayloadSchema = z.object({
  invoiceId: z.string().min(1),
  requestedDueDate: z.iso.date(),
})

export const updatePolicyParameterSchema = z.object({})

export const updatePolicyOutputSchema = z.object({
  allowed: z.boolean(),
  maximumDueDate: z.iso.date().optional(),
})
```

The response schema is intentionally consumer-local. The runtime validates the
downstream response and returns the schema result to this handler. With the Zod
object shown here, unrecognized response fields are stripped by default. That
reduces data propagation and coupling: an unrelated producer field is neither
retained nor made part of this command’s contract. Use the behavior of your
chosen Standard Schema library deliberately.

## 2. Declare the dependency before the handler

```ts title="src/service/invoice/v1/command/updateInvoice/updateInvoiceCommandBuilder.ts"
export const updateInvoiceCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('updateInvoice', 'Update an invoice')
  .canInvoke(
    'InvoicePolicy',
    '1',
    'checkDueDateChange',
    updatePolicyOutputSchema,
    updatePolicyPayloadSchema,
    updatePolicyParameterSchema,
  )
  .addPayloadSchema(updateInvoicePayloadSchema)
  .addParameterSchema(updateInvoiceParameterSchema)
  .addOutputSchema(updateInvoiceOutputSchema)
  .setCommandFunction(async function (context, payload, parameter) {
    const policy = await context.service.InvoicePolicy['1'].checkDueDateChange(
      { invoiceId: parameter.invoiceId, requestedDueDate: payload.dueDate },
      {},
    )

    if (!policy.allowed) {
      throw new HandledError(StatusCode.Conflict, 'The requested due date is not allowed', {
        maximumDueDate: policy.maximumDueDate,
      })
    }

    const invoice = await context.resources.invoices.update(parameter.invoiceId, payload)
    if (!invoice) throw new HandledError(StatusCode.NotFound, 'Invoice does not exist')
    return invoice
  })
```

[`canInvoke(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#caninvoke) adds exactly one typed function at
`context.service.InvoicePolicy['1'].checkDueDateChange`. Service versions are
string keys: the literal passed to `canInvoke(...)` becomes the inferred key on
`context.service`. The declaration records
the dependency in the command definition; it does not start, discover, or make
the target service available.

The surrounding chain retains the command contract defined by
[`getCommandBuilder(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder),
[`addPayloadSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema),
[`addParameterSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema),
and
[`addOutputSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema).
[`setCommandFunction(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction)
installs the handler that can use the declared dependency.

## Understand every `canInvoke` argument

| Argument | Required | Runtime effect |
| --- | --- | --- |
| `serviceName` | Yes | Selects the downstream service. Empty names fail while building the definition. |
| `serviceVersion` | Yes | Selects an explicit versioned contract. Empty versions fail while building. |
| `serviceTarget` | Yes | Selects the downstream command. Empty targets fail while building. |
| `outputSchema` | No | Validates/types the returned value and supplies its parsed result to this handler. A mismatch is an internal failure. |
| `payloadSchema` | No | Validates/types the outgoing payload before the EventBridge invocation. A local mismatch is an internal command failure. |
| `parameterSchema` | No | Validates/types the outgoing parameter before invocation. A local mismatch is an internal command failure. |

Omitting a schema leaves that part of the declared dependency unconstrained; it
does not make the capability undeclared. For service-to-service boundaries,
provide all three schemas unless there is a deliberate reason not to.

Trace, principal, and tenant metadata propagate to the downstream command. The
downstream service must still enforce its own authorization and tenant scope.

A downstream `HandledError` is reconstructed and thrown as a `HandledError` in
this handler. If it is not caught, its status, message, and data become this
command's caller-visible error. Catch and map a downstream error when its public
contract must not pass through your boundary. Unexpected downstream errors and
response-schema mismatches remain internal failures.

## Keep the contract and failure surface small

Do:

- declare only commands whose results are required for the current response;
- define the smallest request and response schemas this handler needs;
- keep policy errors caller-safe and let unexpected transport/provider failures remain internal;
- give the complete chain a timeout budget at the EventBridge/client boundary.

Do not:

- import the producer’s repository/entity type as this command’s public contract;
- turn several remote calls into an assumed distributed transaction;
- retry a non-idempotent downstream side effect blindly;
- catch an unavailable service and report a misleading business conflict.

Next, [publish the command success event](/handbook/framework/build-services/commands/publish-success-event/) so independent subscribers can react after the update completes.

For the exact signature, see [`canInvoke`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#caninvoke).
