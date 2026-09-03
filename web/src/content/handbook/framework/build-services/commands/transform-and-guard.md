---
title: Transform and guard command execution
description: Validate wire data before transforming it, then add independent guards at the safe points around command behavior.
order: 327
---

Use a transform when a supported input or output representation differs from
the command’s domain contract. Use a guard for a short policy or invariant
check. Neither replaces the command’s business behavior.

Common boundaries are:

| Need | Stage | Example |
| --- | --- | --- |
| Accept a legacy or external representation | Input transform | Convert XML or a legacy field layout into the current JSON-shaped domain input. |
| Open an application-owned encrypted envelope | Input transform | Decrypt, then return the command payload and parameter shape. Keep transport authentication in the HTTP/bridge boundary. |
| Authorize before side effects | Before guard | Verify trusted principal/tenant policy or a signature carried in the validated command contract. |
| Protect against misuse | Before or after guard | Reject quota, size, frequency, or result-policy violations at the earliest applicable stage. |
| Prevent sensitive output | Output schema and after guard | Allow only public fields; use a strict schema when extra fields must cause an internal failure. |
| Serve another response representation | Output transform | Encrypt, sign, or convert the verified result to XML/CSV. |

## Put each hook in the lifecycle

The complete order is:

```text title="Command transform, validation, and guard order"
raw parameter schema → raw payload schema → input transform
→ domain payload + parameter schemas → before guards → handler
→ domain output schema → after guards → output transform
→ transformed-output schema → success response
```

The raw schemas and input transform exist only when `setTransformInput(...)`
is configured. The output transform and transformed-output schema exist only
when `setTransformOutput(...)` is configured. Domain input/output schemas keep
their positions in both cases.

| Hook | Receives | Runs | Use it for |
| --- | --- | --- | --- |
| [`setTransformInput(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#settransforminput) | Transform context, raw payload, raw parameter | After raw schemas validate; before normal command schemas. | Convert supported wire data to `{ payload, parameter }`. |
| [`setBeforeGuardHooks(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setbeforeguardhooks) | Full command context, validated payload, parameter | After normal input validation; before the handler. | Short authorization, quota, or invariant checks. |
| [`setAfterGuardHooks(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setafterguardhooks) | Full command context, validated handler result, payload, parameter | After output-schema validation; before output transform/success. | A bounded post-result assertion or audit check. |
| [`setTransformOutput(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#settransformoutput) | Transform context, validated result, parameter | After after guards; its returned representation is then validated before success. | Convert the verified domain result to a supported response representation. |

Transforms receive the base runtime context, original message, and service
resources. They do not receive command, stream, or custom-event capability
proxies. The output transform receives the runtime queue context, including the
typed declared queue namespace; the input transform receives only the untyped
base queue context. Keep queueing business work in the handler even though the
output runtime can expose that client. Guards receive the full command context.

The before-guard phase does not run before the input transform. If a signature
or certificate must be checked before parsing or decrypting the received value,
verify it in the transport boundary or as the first operation inside the input
transform. Keep the later before guard for policy over the validated domain
payload, parameter, trusted principal, and tenant.

## Validate raw input, then transform it

PURISTA validates the raw **parameter first**, then the raw payload. It calls the transform only after both pass, then validates the transform’s returned `{ payload, parameter }` against `addPayloadSchema(...)` and `addParameterSchema(...)`.

```ts title="src/service/invoice/v1/command/updateInvoice/updateInvoiceCommandBuilder.ts"
export const updateInvoiceCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('updateInvoice', 'Update an invoice')
  .addPayloadSchema(updateInvoicePayloadSchema)
  .addParameterSchema(updateInvoiceParameterSchema)
  .addOutputSchema(updateInvoiceOutputSchema)
  .setTransformInput(z.string(), updateInvoiceParameterSchema, async function (_context, xml, parameter) {
    return {
      payload: parseLegacyInvoiceUpdateXml(xml),
      parameter,
    }
  }, 'text/xml', 'utf-8')
  .setCommandFunction(async function (context, payload, parameter) {
    const invoice = await context.resources.invoices.update(parameter.invoiceId, payload)
    if (!invoice) throw new HandledError(StatusCode.NotFound, 'Invoice does not exist')
    return invoice
  })
```

| [`setTransformInput(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#settransforminput) argument | Meaning |
| --- | --- |
| `rawPayloadSchema` | Schema for the received, pre-transform payload. |
| `rawParameterSchema` | Schema for the received, pre-transform parameter. |
| `transformFunction` | Non-arrow async function returning `{ payload, parameter }` for the command schemas. |
| `inputContentType`, `inputContentEncoding` | Optional request metadata; if omitted, an earlier value or the definition defaults apply. |

Throw `HandledError` only for an expected, safe rejection. Any other transform
failure is treated as an internal error. Keep slow I/O, retries, and side
effects out of a transform. When decryption needs a secret, read it through the
transform context's secret store; never put the key or decrypted data in logs,
traces, metrics, or the handled error.

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

The output transform does not receive command, stream, or custom-event clients.
At runtime it does receive the typed queue namespace declared by the command,
although the public transform context type currently exposes only the base
queue shape. Treat this as a representation boundary and keep new business work
in the handler. Use the content type only with an HTTP runtime that can
serve it, as described in [Expose a command](/handbook/framework/build-services/commands/expose-a-command/).

[`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder) still creates the local service contract; [`addPayloadSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema) and [`addParameterSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema) validate input, while [`addOutputSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema) validates the domain result before this output transform. [`setCommandFunction(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) installs the service-bound producer of that domain result.

## Add independent guards

Named hooks merge by name; a later hook with the same name replaces the previous one. All hooks in each before/after group run in parallel. Do not make one guard rely on another guard’s side effect or ordering.

```ts title="src/service/invoice/v1/command/updateInvoice/updateInvoiceCommandBuilder.ts"
export const updateInvoiceCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('updateInvoice', 'Update an invoice')
  .addPayloadSchema(updateInvoicePayloadSchema)
  .addParameterSchema(updateInvoiceParameterSchema)
  .addOutputSchema(updateInvoiceOutputSchema)
  .setBeforeGuardHooks({
    requireTenant: async function (context) {
      if (!context.message.tenantId) throw new HandledError(StatusCode.Forbidden, 'A tenant is required')
    },
  })
  .setAfterGuardHooks({
    preserveInvoiceIdentity: async function (_context, result, _payload, parameter) {
      if (result.invoiceId !== parameter.invoiceId) throw new Error('invoice identity changed')
    },
  })
  .setCommandFunction(async function (context, payload, parameter) {
    const invoice = await context.resources.invoices.update(parameter.invoiceId, payload)
    if (!invoice) throw new HandledError(StatusCode.NotFound, 'Invoice does not exist')
    return invoice
  })
```

All transform and guard callbacks must be non-arrow functions. A guard failure
prevents later stages and a success response. `getCommandFunction()` runs before
guards but does not run after guards or the output transform; those stages are
owned by `Service.executeCommand`. Use
[`createCommandTestHarness(...)`](/handbook/api/functions/_purista_core.createCommandTestHarness/)
to prove their real ordering, or retrieve one named hook for a narrow unit test.
See [Handle command errors](/handbook/framework/build-services/commands/handle-errors/)
for safe error classification and [Test a command](/handbook/framework/build-services/commands/test-a-command/)
for both test boundaries.

| Call | Required argument | Effect |
| --- | --- | --- |
| [`setBeforeGuardHooks(hooks)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setbeforeguardhooks) | A record whose keys name before-handler callbacks. | Replaces or adds checks after input validation and before the handler. |
| [`setAfterGuardHooks(hooks)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setafterguardhooks) | A record whose keys name after-handler callbacks. | Replaces or adds checks after output validation and before an output transform or success response. |

Both calls merge the supplied record into their respective stage. A repeated key
replaces that stage's earlier callback; distinct callbacks run concurrently.
Use separate guards for independent checks and put ordered business work in the
command handler instead.

## Know how each stage fails

| Failure point | Classification | What can leave the service |
| --- | --- | --- |
| Raw transform schema | Handled `400 Bad Request` | Validation issues for caller-owned input. |
| Input transform callback | A thrown `HandledError` remains public; every other error becomes internal `500`. | Only deliberately safe handled data. |
| Domain payload/parameter schema | Handled `400 Bad Request` | Validation issues for caller-owned input. |
| Before/after guard | A thrown `HandledError` remains public; every other error becomes internal `500`. | Only deliberately safe handled data. |
| Handler output schema | Internal `500`. | Generic internal-error response and trace ID. |
| Output transform callback or schema | A deliberate `HandledError` remains public; otherwise internal `500`. Invalid transformed output is always internal. | No transform exception, invalid output, secret, or sensitive result detail. |

For sensitive output, prefer a minimal strict output schema over a guard that
tries to enumerate every forbidden field. Use an after guard for policy over
the already verified result; use the output transform when the public format
must differ.

For this guard chain, [`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder) names the operation; [`addPayloadSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema), [`addParameterSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema), and [`addOutputSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema) determine the values guards receive; [`setCommandFunction(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) supplies the handler between the two guard stages. Optional content type/encoding metadata belongs to payload/output schema calls, not to guards.

For exact callback types, see [CommandDefinitionBuilder](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/).
