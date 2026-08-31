---
title: Expose a command
description: Add HTTP projection and OpenAPI metadata to a command while leaving service ownership, startup, and transport behavior in the HTTP runtime.
order: 329
---

HTTP exposure is metadata on a command definition. It does not start a listener, register an HTTP server, or move business logic into the handler. First choose the Hono deployment mode and startup order in [HTTP runtime architecture](/handbook/framework/expose-and-consume-services/http-and-rest/runtime-architecture/).

## Project one command to HTTP

```ts title="src/service/invoice/v1/command/updateInvoice/updateInvoiceCommandBuilder.ts"
export const updateInvoiceCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('updateInvoice', 'Update an invoice')
  .addPayloadSchema(updateInvoicePayloadSchema)
  .addParameterSchema(updateInvoiceParameterSchema)
  .addOutputSchema(updateInvoiceOutputSchema)
  .exposeAsHttpEndpoint('PATCH', 'invoices/:invoiceId')
  .addQueryParameters({ name: 'notify', required: false })
  .setOpenApiSummary('Update an invoice')
  .setOpenApiOperationId('updateInvoice')
  .setCommandFunction(async function (context, payload, parameter) {
    const invoice = await context.resources.invoices.update(parameter.invoiceId, payload)
    if (!invoice) throw new HandledError(StatusCode.NotFound, 'Invoice does not exist')
    return invoice
  })
```

[`exposeAsHttpEndpoint(method, path, ...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#exposeashttpendpoint)
adds an HTTP projection to the existing command definition. It does not create
a second handler or bypass the command schemas and lifecycle.

## Map path and query values into `parameter`

HTTP path and query values do not become command payload fields. Hono combines
query values, path values, and protection-middleware parameters into the one
command `parameter` object. Path and query values arrive as strings; the
command parameter schema parses, validates, and types the combined object
before guards or the handler run.

The schema used by this endpoint explicitly contains both HTTP inputs:

```ts title="src/service/invoice/v1/command/updateInvoice/updateInvoiceSchemas.ts"
export const updateInvoiceParameterSchema = z.object({
  invoiceId: z.string().min(1).describe('Invoice identifier from the URL path'),
  notify: z.union([z.boolean(), z.stringbool()]).optional().default(false)
    .describe('Whether the caller requests a notification'),
}).strict()
```

### Define URL path parameters

Write a Hono path parameter as `:name` in the relative endpoint path. The name
must exactly match a field in the command parameter schema:

| HTTP contract | Definition | Handler value |
| --- | --- | --- |
| Required invoice identifier | `.exposeAsHttpEndpoint('PATCH', 'invoices/:invoiceId')` | `parameter.invoiceId` after `updateInvoiceParameterSchema` validates it. |

Use `:invoiceId`, not `{invoiceId}` and not a literal `invoiceId` segment. A
normal path parameter is required by the route, so keep its schema field
required too. The path is relative to the server’s configured mount and
service-version route. With Hono's default `/api` mount and service version
`1`, the example produces `PATCH /api/v1/invoices/:invoiceId`.

### Define required and optional query parameters

Declare each documented query field with
[`addQueryParameters(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addqueryparameters)
after `addParameterSchema(...)`. The schema makes `name` an inferred key, while
the query definition controls whether OpenAPI tells clients that the value is
required.

| Query behavior | Query definition | Matching parameter schema |
| --- | --- | --- |
| Required | `{ name: 'locale', required: true }` | `locale: z.string().min(2)` |
| Optional | `{ name: 'notify', required: false }` | `notify: z.stringbool().optional()` |
| Optional with a parsed default | `{ name: 'notify', required: false }` | `notify: z.stringbool().optional().default(false)` |

The two declarations must agree. `required` is OpenAPI metadata; it does not
perform runtime validation. A non-optional schema field rejects a missing query
value even when OpenAPI marks it optional, while an optional schema field
accepts absence even when OpenAPI marks it required. Use a string parser such
as `z.stringbool()` or a deliberate numeric coercion because Hono supplies raw
query strings. Avoid `z.coerce.boolean()`: the non-empty string `"false"` is
truthy and becomes `true`.

For the shown endpoint, `PATCH /api/v1/invoices/invoice-42?notify=true`
produces the validated command parameter
`{ invoiceId: 'invoice-42', notify: true }`. The strict object schema rejects
undeclared query fields. Avoid giving a query and path field the same name;
Hono merges query values first and path values afterward.

The request body becomes `payload` for `PATCH`, `POST`, and `PUT` requests.
Keep route parsing, server startup, and transport authentication in the HTTP
runtime; keep business authorization near the service/command boundary.

The projection keeps the command’s local contract intact: [`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder) names the operation; [`addPayloadSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema) and [`addParameterSchema(schema)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema) validate public request data; [`addOutputSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema) validates its successful result; and [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) remains the non-arrow, service-bound business implementation. HTTP metadata does not create a second handler or a different response schema.

[`setOpenApiSummary(summary)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setopenapisummary)
sets the reader-facing operation summary, while
[`setOpenApiOperationId(id)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setopenapioperationid)
sets the stable client-facing identifier. Both default to the command name when
omitted; use the explicit ID only when generated clients or an external API
contract need a name that must remain stable across internal refactors.

## Configure the HTTP projection

| [`exposeAsHttpEndpoint` argument](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#exposeashttpendpoint) | Default | Meaning |
| --- | --- | --- |
| `method` | Required | Supported method: `GET`, `POST`, `PUT`, `PATCH`, or `DELETE`. |
| `path` | Required | Relative Hono route, such as `invoices/:invoiceId`; the server prepends `apiMountPath` and `v${serviceVersion}`. |
| `contentTypeRequest` / `contentEncodingRequest` | Schema/transform metadata, then `application/json` / `utf-8` | Expected request representation. |
| `contentTypeResponse` / `contentEncodingResponse` | Schema/transform metadata, then `application/json` / `utf-8` | Declared response representation. |
| `options.mode` | `sync` | `sync` returns the command result. `async` makes Hono return `202 Accepted` only when the command returns a queue-enqueue result; it does not enqueue work itself. |

### Return queue acceptance from an async route

Use asynchronous HTTP mode for a command that accepts work now and exposes its
completion through a queue result, event, or application-owned status resource.
The command must declare the queue and return the result of
`context.queue.enqueue.<queue>(...)` unchanged. Hono requires its `jobId` and
`queueName`; a different result is an internal `500` error, not a `202`.

```ts title="src/service/invoice/v1/command/requestInvoiceExport/requestInvoiceExportCommandBuilder.ts"
import { z } from 'zod'
import { invoiceV1ServiceBuilder } from '../../invoiceV1ServiceBuilder.js'

const input = z.object({ invoiceId: z.string().min(1) })
const parameter = z.object({})
const exportJob = z.object({ invoiceId: z.string().min(1) })

export const requestInvoiceExportCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('requestInvoiceExport', 'Queues one invoice export')
  .canEnqueue('invoiceExport', exportJob)
  .addPayloadSchema(input)
  .addParameterSchema(parameter)
  .exposeAsHttpEndpoint(
    'POST',
    'invoices/export',
    'application/json',
    'utf-8',
    'application/json',
    'utf-8',
    { mode: 'async' },
  )
  .setCommandFunction(async function (context, payload) {
    return context.queue.enqueue.invoiceExport({ invoiceId: payload.invoiceId })
  })
```

Hono normalizes a successful response to `202` with `{ jobId, queue,
queueName, status: 'queued', scheduledAt? }`; it includes `runId` only when the
command supplied one. This proves queue acceptance, not worker completion. Add
a status URL or completion event through the workflow that owns the queue
result; do not manufacture one in the HTTP handler.

In the asynchronous form, [`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder) still identifies the request-reply command. [`canEnqueue(queueName, payloadSchema?, parameterSchema?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canenqueue) declares—not creates—the target queue client. [`addPayloadSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema) and [`addParameterSchema(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema) validate the incoming request; no output schema is needed because the handler returns the queue receipt that [`exposeAsHttpEndpoint(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#exposeashttpendpoint) checks for async mode. [`setCommandFunction(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) must return that receipt unchanged.

## Make security and OpenAPI explicit

| Method | Default/effect | Use it for |
| --- | --- | --- |
| [`enableHttpSecurity(enabled = true)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#enablehttpsecurity) | Secure projection metadata by default; Hono invokes its configured protection middleware for the route. | Explicitly preserve or set the route’s protection requirement. This does not authenticate a request without real Hono middleware. |
| [`makeEndpointPublic()`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#makeendpointpublic) | Marks the projection public and omits route protection metadata. | An intentionally public endpoint with abuse controls. |
| [`disableHttpSecurity(disabled = true)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#disablehttpsecurity) | Deprecated; also marks the projection public when true. | Existing-code migration only. |
| [`setOpenApiSummary(summary)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setopenapisummary) / [`setOpenApiOperationId(id)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setopenapioperationid) | Defaults are the command name when unset. | Human summary and stable client-facing operation identifier. |
| [`addOpenApiTags(...tags)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addopenapitags) | Adds OpenAPI tag metadata. | Group the operation; verify generated output for your current release. |
| [`addOpenApiErrorStatusCodes(...codes)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addopenapierrorstatuscodes) | Adds documented response codes; async exposure adds `Accepted`. | Describe expected error outcomes without changing runtime behavior. |
| [`addQueryParameters(...definitions)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addqueryparameters) | OpenAPI metadata only. | Document query values; pair with a parameter schema for runtime validation. |

[`addQueryParameters(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addqueryparameters) does not validate values. Hono collects query/path values even without OpenAPI query metadata; declare a parameter schema for every value the command accepts, use coercion where the HTTP representation is a string, and verify the complete adapter behavior in [Configure Hono](/handbook/framework/expose-and-consume-services/http-and-rest/hono/) and [HTTP runtime architecture](/handbook/framework/expose-and-consume-services/http-and-rest/runtime-architecture/).

The secure setting selects Hono's `protectHandler`; its default handler passes
requests through. Configure a real
[`setProtectMiddleware(...)`](/handbook/api/classes/_purista_hono-http-server.HonoServiceClass/#setprotectmiddleware)
before treating a secure endpoint as authenticated, and retain a service/command
guard for business authorization.

For signatures, see [CommandDefinitionBuilder](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/).
