---
title: Expose a command
description: Add HTTP projection and OpenAPI metadata to a command while leaving service ownership, startup, and transport behavior in the HTTP runtime.
order: 331
---

HTTP exposure is metadata on a command definition. It does not start a listener, register an HTTP server, or move business logic into the handler. First choose the Hono deployment mode and startup order in [HTTP runtime architecture](/handbook/framework/expose-and-consume-services/http-and-rest/runtime-architecture/).

## Project one command to HTTP

```ts title="src/service/invoice/v1/command/createInvoice/createInvoiceCommandBuilder.ts"
export const createInvoiceCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('createInvoice', 'Create an invoice')
  .addPayloadSchema(createInvoicePayloadSchema)
  .addParameterSchema(createInvoiceParameterSchema)
  .addOutputSchema(createInvoiceOutputSchema)
  .exposeAsHttpEndpoint('POST', 'invoices')
  .setOpenApiSummary('Create an invoice')
  .setOpenApiOperationId('createInvoice')
  .setCommandFunction(async function (context, payload) {
    return context.resources.invoices.create(payload)
  })
```

The path is relative to the server’s configured mount and service-version route. Keep route parsing, server startup, and transport authentication in the HTTP runtime; keep business authorization near the service/command boundary.

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
| `path` | Required | Relative command route, such as `invoices/:invoiceId`. |
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

[`addQueryParameters(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addqueryparameters) does not validate or inject values by itself. Declare a parameter schema for every public path/query value, then verify the complete adapter behavior in [Configure Hono](/handbook/framework/expose-and-consume-services/http-and-rest/hono/) and [HTTP runtime architecture](/handbook/framework/expose-and-consume-services/http-and-rest/runtime-architecture/).

The secure setting selects Hono's `protectHandler`; its default handler passes
requests through. Configure a real
[`setProtectMiddleware(...)`](/handbook/api/classes/_purista_hono-http-server.HonoServiceClass/#setprotectmiddleware)
before treating a secure endpoint as authenticated, and retain a service/command
guard for business authorization.

For signatures, see [CommandDefinitionBuilder](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/).
