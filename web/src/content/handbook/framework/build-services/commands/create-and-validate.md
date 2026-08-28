---
title: Create and validate a command
description: Define a command contract and a service-bound handler that receives validated input and returns a verified result.
order: 321
---

Finish this page with a command whose input cannot reach the handler in an invalid shape and whose result cannot leave the runtime in an invalid shape.

You need a versioned [service](/handbook/framework/build-services/services/) and its service builder. The builder creates the command definition; the service registers and executes it.

## Define the contract before behavior

`payload` is the requested business input. `parameter` is a separate selector object, useful for route or query values when the command is projected to HTTP. The output is the public result—not a repository record or provider response.

```ts title="src/service/invoice/v1/command/createInvoice/createInvoiceCommandBuilder.ts"
import { z } from 'zod'

const createInvoicePayloadSchema = z.object({
  customerId: z.string().min(1),
  amountCents: z.number().int().positive(),
})
const createInvoiceParameterSchema = z.object({})
const createInvoiceOutputSchema = z.object({ invoiceId: z.string() })

export const createInvoiceCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('createInvoice', 'Create an invoice')
  .addPayloadSchema(createInvoicePayloadSchema)
  .addParameterSchema(createInvoiceParameterSchema)
  .addOutputSchema(createInvoiceOutputSchema)
  .setCommandFunction(async function (context, payload, _parameter) {
    const invoice = await context.resources.invoices.create(payload)
    return { invoiceId: invoice.id }
  })
```

Use `async function`, not an arrow function. PURISTA binds the function’s `this` value to the service instance and rejects arrow functions. The handler receives readonly, validated `payload` and `parameter` values.

## Know what each definition method does

| Method | Parameters and defaults | Runtime effect | Use it for |
| --- | --- | --- | --- |
| [`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder) | A non-empty service-local name, a required human-readable description, and an optional non-empty success-event name. | Creates a command builder already typed with the service's declared resources and metrics; it does not register or execute the command. | Start one stable service operation. Choose the optional event name only when the canonical success fact is already known; [`Publish the success event`](/handbook/framework/build-services/commands/publish-success-event/) compares both naming forms. |
| [`addPayloadSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema) | One Standard Schema; optional media values are retained from an earlier call or default to JSON and UTF-8 in the definition. | Validates the domain payload before before guards and the handler. | Request body/domain input. |
| [`addParameterSchema(schema)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema) | One Standard Schema; it does not supply an empty object automatically. | Validates the separate parameter value before before guards and the handler. | Path, query, or explicit caller selectors. |
| [`addOutputSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema) | One Standard Schema; optional response media values are retained or default to JSON and UTF-8. | Validates the handler result before after guards and output transformation. | A stable public result contract. |
| [`setCommandFunction(fn)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) | `async function (context, payload, parameter) {}`. | Installs the required service-bound handler. | The bounded business operation. |

When input validation fails, the handler does not run and the runtime returns a handled bad-request error. When output validation fails, it is an internal failure; after guards and output transformation do not run.

## Make the first result observable

Generate and register the command definition before the service resolves its
definitions. `getDefinition()` fails without `setCommandFunction(...)`; adding
it after the service builder has resolved definitions fails as well.

```ts title="src/service/invoice/v1/invoiceV1Service.ts"
import { createInvoiceCommandBuilder } from './command/createInvoice/createInvoiceCommandBuilder.js'
import { invoiceV1ServiceBuilder } from './invoiceV1ServiceBuilder.js'

const createInvoice = await createInvoiceCommandBuilder.getDefinition()

export const invoiceV1Service = invoiceV1ServiceBuilder
  .addCommandDefinition(createInvoice)
```

The command result is the output-schema value, for example
`{ invoiceId: 'inv-42' }`; it is not proof that downstream subscribers have
finished. The service builder owns the same stage for every command, so use
[`addCommandDefinition(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addcommanddefinition)
rather than registering a command ad hoc at runtime.

For a deterministic invocation and expected result without an external broker,
follow [Test a command](/handbook/framework/build-services/commands/test-a-command/).

## Put each concern at the right boundary

| Need | Use | Avoid |
| --- | --- | --- |
| Convert a supported wire representation into the domain input | Input transform | Parsing transport-specific data throughout the handler. |
| Reject a short policy or invariant before a side effect | Before guard | Starting a second workflow in a guard. |
| Return a caller-safe business rejection | `HandledError` | Returning a fake success or leaking an upstream error. |
| Let other services react after success | Named success event | Treating it as an atomic outbox. |

Next, add [transforms and guards](/handbook/framework/build-services/commands/transform-and-guard/), [error handling](/handbook/framework/build-services/commands/handle-errors/), or a [success event](/handbook/framework/build-services/commands/publish-success-event/).

For signatures and generic types, see [CommandDefinitionBuilder](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/).
