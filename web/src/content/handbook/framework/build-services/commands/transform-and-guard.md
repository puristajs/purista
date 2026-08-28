---
title: Transform and guard command execution
description: Validate wire data before transforming it, then add independent guards at the safe points around command behavior.
order: 322
---

Use a transform when a supported input or output representation differs from the command’s domain contract. Use a guard for a short policy or invariant check. Neither replaces the command’s business behavior.

## Put each hook in the lifecycle

| Hook | Receives | Runs | Use it for |
| --- | --- | --- | --- |
| [`setTransformInput(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#settransforminput) | Transform context, raw payload, raw parameter | After raw schemas validate; before normal command schemas. | Convert supported wire data to `{ payload, parameter }`. |
| [`setBeforeGuardHooks(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setbeforeguardhooks) | Full command context, validated payload, parameter | After normal input validation; before the handler. | Short authorization, quota, or invariant checks. |
| [`setAfterGuardHooks(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setafterguardhooks) | Full command context, validated handler result, payload, parameter | After output-schema validation; before output transform/success. | A bounded post-result assertion or audit check. |
| [`setTransformOutput(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#settransformoutput) | Transform context, validated result, parameter | After after guards; before the successful response. | Convert the verified domain result to a supported response representation. |

Transforms receive the base runtime context, original message, and service resources. They do not receive command, stream, or custom-event capability proxies. Guards receive the full command context.

## Validate raw input, then transform it

PURISTA validates the raw **parameter first**, then the raw payload. It calls the transform only after both pass, then validates the transform’s returned `{ payload, parameter }` against `addPayloadSchema(...)` and `addParameterSchema(...)`.

```ts title="src/service/invoice/v1/command/importInvoice/importInvoiceCommandBuilder.ts"
export const importInvoiceCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('importInvoice', 'Import one invoice')
  .addPayloadSchema(invoicePayloadSchema)
  .addParameterSchema(invoiceParameterSchema)
  .addOutputSchema(importResultSchema)
  .setTransformInput(rawCsvSchema, rawImportParameterSchema, async function (_context, rawPayload, rawParameter) {
    return {
      payload: parseInvoiceCsv(rawPayload),
      parameter: rawParameter,
    }
  }, 'text/csv', 'utf-8')
  .setCommandFunction(async function (context, payload) {
    return context.resources.invoices.import(payload)
  })
```

| [`setTransformInput(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#settransforminput) argument | Meaning |
| --- | --- |
| `rawPayloadSchema` | Schema for the received, pre-transform payload. |
| `rawParameterSchema` | Schema for the received, pre-transform parameter. |
| `transformFunction` | Non-arrow async function returning `{ payload, parameter }` for the command schemas. |
| `inputContentType`, `inputContentEncoding` | Optional request metadata; if omitted, an earlier value or the definition defaults apply. |

Throw `HandledError` only for an expected, safe rejection. Any other transform failure is treated as an internal error. Keep slow I/O, retries, and side effects out of a transform.

The surrounding command calls are [`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder), [`addPayloadSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema), [`addParameterSchema(schema)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema), [`addOutputSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema), and [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction). The local schemas validate the transformed domain values; the raw schemas above validate the incoming representation first.

## Transform the verified result for the public response

Use an output transform only when the handler's domain result and the public
representation intentionally differ. The handler result is validated by
`addOutputSchema(...)` first; after guards receive that domain value. The
transform then creates and validates the value returned to the caller.

```ts title="src/service/invoice/v1/command/exportInvoice/exportInvoiceCommandBuilder.ts"
const invoiceDomainOutputSchema = z.object({ invoiceId: z.string(), totalCents: z.number().int() })
const invoiceCsvSchema = z.string()

export const exportInvoiceCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('exportInvoice', 'Exports one invoice as CSV')
  .addPayloadSchema(exportInvoicePayloadSchema)
  .addParameterSchema(exportInvoiceParameterSchema)
  .addOutputSchema(invoiceDomainOutputSchema)
  .setTransformOutput(
    invoiceCsvSchema,
    async function (_context, result) {
      return `invoiceId,totalCents\n${result.invoiceId},${result.totalCents}`
    },
    'text/csv',
    'utf-8',
  )
  .setCommandFunction(async function (_context, payload) {
    return loadInvoiceForExport(payload.invoiceId)
  })
```

| [`setTransformOutput(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#settransformoutput) argument | Meaning |
| --- | --- |
| `transformOutputSchema` | Schema for the returned representation, such as the CSV string. A mismatch is an internal error. |
| `transformFunction` | A non-arrow async function receiving base transform context, the validated domain result, and validated parameter. It returns the public representation. |
| `outputContentType`, `outputContentEncoding` | Optional media metadata. An explicit value replaces the previous output setting; otherwise the earlier setting or definition default applies. |

The output transform does not give the callback command, stream, queue, or
custom-event clients. It is a representation boundary, not a place to initiate
new business work. Use the content type only with an HTTP runtime that can
serve it, as described in [Expose a command](/handbook/framework/build-services/commands/expose-a-command/).

[`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder) still creates the local service contract; [`addPayloadSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema) and [`addParameterSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema) validate input, while [`addOutputSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema) validates the domain result before this output transform. [`setCommandFunction(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) installs the service-bound producer of that domain result.

## Add independent guards

Named hooks merge by name; a later hook with the same name replaces the previous one. All hooks in each before/after group run in parallel. Do not make one guard rely on another guard’s side effect or ordering.

```ts title="src/service/invoice/v1/command/createInvoice/createInvoiceCommandBuilder.ts"
export const createInvoiceCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('createInvoice', 'Create an invoice')
  .addPayloadSchema(createInvoicePayloadSchema)
  .addParameterSchema(createInvoiceParameterSchema)
  .addOutputSchema(createInvoiceOutputSchema)
  .setBeforeGuardHooks({
    requireTenant: async function (context) {
      if (!context.message.tenantId) throw new HandledError(StatusCode.Forbidden, 'A tenant is required')
    },
  })
  .setAfterGuardHooks({
    requireInvoiceId: async function (_context, result) {
      if (!result.invoiceId) throw new Error('invoice result has no identifier')
    },
  })
  .setCommandFunction(async function (context, payload) {
    return context.resources.invoices.create(payload)
  })
```

All transform and guard callbacks must be non-arrow functions. A guard failure prevents later stages and a success response. See [Handle command errors](/handbook/framework/build-services/commands/handle-errors/) for safe error classification and [Test a command](/handbook/framework/build-services/commands/test-a-command/) to test a hook in isolation.

| Call | Required argument | Effect |
| --- | --- | --- |
| [`setBeforeGuardHooks(hooks)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setbeforeguardhooks) | A record whose keys name before-handler callbacks. | Replaces or adds checks after input validation and before the handler. |
| [`setAfterGuardHooks(hooks)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setafterguardhooks) | A record whose keys name after-handler callbacks. | Replaces or adds checks after output validation and before an output transform or success response. |

Both calls merge the supplied record into their respective stage. A repeated key
replaces that stage's earlier callback; distinct callbacks run concurrently.
Use separate guards for independent checks and put ordered business work in the
command handler instead.

For this guard chain, [`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder) names the operation; [`addPayloadSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema), [`addParameterSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema), and [`addOutputSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema) determine the values guards receive; [`setCommandFunction(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) supplies the handler between the two guard stages. Optional content type/encoding metadata belongs to payload/output schema calls, not to guards.

For exact callback types, see [CommandDefinitionBuilder](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/).
