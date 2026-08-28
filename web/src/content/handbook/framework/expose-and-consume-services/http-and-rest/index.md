---
title: HTTP and REST
description: Project selected commands and streams through an independently composed HTTP server without moving business behavior into routes.
order: 410
---

HTTP is an adapter around a command or stream contract. The HTTP server owns
ports, routes, parsing, middleware, public error responses, and OpenAPI. The
business service owns validation, authorization, workflow behavior, queues, and
events. That separation lets the same command be called through the
EventBridge without a second implementation.

The first decision is deployment topology, because it changes how Hono learns
which routes exist. Read [HTTP runtime architecture and startup](/handbook/framework/expose-and-consume-services/http-and-rest/runtime-architecture/)
before wiring the server.

## Expose one validated command

`@purista/core` stores HTTP/OpenAPI metadata but does not listen on a port.
This command accepts one health-oriented value and explicitly becomes
`POST /api/v1/ping` when the selected HTTP server registers its service.

```ts title="src/service/ping/v1/command/ping/pingCommandBuilder.ts"
import { extendApi } from '@purista/core'
import { z } from 'zod'
import { pingV1ServiceBuilder } from '../../pingV1ServiceBuilder.js'

const pingPayloadSchema = extendApi(
  z.object({ ping: z.string().min(1).max(100) }),
  { title: 'ping request' },
)

const pingResultSchema = extendApi(
  z.object({ pong: z.string() }),
  { title: 'ping response' },
)

export const pingCommandBuilder = pingV1ServiceBuilder
  .getCommandBuilder('ping', 'Reply to a health-oriented ping')
  .addPayloadSchema(pingPayloadSchema)
  .addOutputSchema(pingResultSchema)
  .exposeAsHttpEndpoint('POST', 'ping')
  .setCommandFunction(async function (_context, payload) {
    return { pong: payload.ping }
  })
```

Register the command definition in its service aggregate as described in
[Services](/handbook/framework/build-services/services/). A command that is not
marked with `exposeAsHttpEndpoint(...)` remains unavailable over HTTP even when
its service is registered.

| Declaration | What it establishes | Options, default, and important boundary |
| --- | --- | --- |
| [`getCommandBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder) | The service-owned command contract. `ping` becomes the command target; the description is operational/API context, not a client-visible result. | The name is part of the command address and cannot be changed casually after clients depend on it. |
| [`addPayloadSchema(schema)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema) | The request shape validated before the handler runs. `extendApi` retains the Zod validation while adding an OpenAPI title. | Keep externally supplied values in this schema. Identity and trusted routing metadata come from the HTTP/service context, not the JSON body. |
| [`addOutputSchema(schema)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema) | The successful synchronous result contract and its OpenAPI schema. | The Hono projection validates the command result through the command runtime; use a stable, deliberately small public result. |
| [`exposeAsHttpEndpoint(method, path, requestType?, requestEncoding?, responseType?, responseEncoding?, options?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#exposeashttpendpoint) | HTTP and OpenAPI metadata only; the Hono service later turns it into a route. | `method` is `GET`, `POST`, `PUT`, `PATCH`, or `DELETE`; `path` is relative to Hono’s API mount and service version. The four optional representation arguments default to `application/json` and `utf-8`. `options.mode` defaults to `sync`; choose `async` only for an acceptance receipt. |
| [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) | The business implementation that the EventBridge invokes. | Its receiver is the service; use `async function`, not an arrow, when the handler needs the service receiver. See [create and validate a command](/handbook/framework/build-services/commands/create-and-validate/) for lifecycle hooks, errors, parameters, and response behavior. |

The shown endpoint retains Hono’s default protected status. Configure the edge
middleware and make an endpoint public only through the explicit security
decision described in [authentication and authorization](/handbook/framework/secure-and-operate/security/authentication-and-authorization/).

## Enable a server adapter

Hono is the first-party HTTP server package. Install it only for applications
that need an HTTP boundary:

```sh title="Install the Hono HTTP server"
npm install @purista/hono-http-server @hono/node-server
```

Then follow [Configure Hono](/handbook/framework/expose-and-consume-services/http-and-rest/hono/)
to install and configure the optional package, OpenAPI, health checks, request
limits, and protection middleware.

| Requirement | Command exposure choice |
| --- | --- |
| Normal request/reply | `exposeAsHttpEndpoint(...)` with a validated output schema |
| Long-running accepted work | Async exposure, queue enqueue, and a durable result contract |
| Progressive HTTP response | A [stream definition and HTTP stream exposure](/handbook/framework/build-services/streams/termination-and-failures/) |
| Aggregate or streaming agent service | [Attached-agent HTTP projection](/handbook/framework/build-ai-powered-services/expose-and-invoke-an-attached-agent/) |
| Internal-only operation | Do not expose it; invoke through its appropriate internal contract |

## Return acceptance, not completion, for queued work

For work that might outlast the request, explicitly expose an asynchronous
command, declare the queue contract, and return the acceptance reference. The
client polls or subscribes to a distinct result contract; a `202 Accepted` is
not a completed report.

```ts title="src/service/report/v1/command/requestReport/requestReportCommandBuilder.ts"
import { extendApi } from '@purista/core'
import { z } from 'zod'
import { reportV1ServiceBuilder } from '../../reportV1ServiceBuilder.js'
import { generateReportPayloadSchema } from '../../queue/generateReport/schema.js'

const requestReportPayloadSchema = extendApi(
  z.object({ reportId: z.string().uuid() }),
  { title: 'report request' },
)

const requestReportResultSchema = extendApi(
  z.object({
    jobId: z.string(),
    queueName: z.string(),
    scheduledAt: z.number().optional(),
  }),
  { title: 'accepted report job' },
)

export const requestReportCommandBuilder = reportV1ServiceBuilder
  .getCommandBuilder('requestReport', 'Accept report generation')
  .addPayloadSchema(requestReportPayloadSchema)
  .addOutputSchema(requestReportResultSchema)
  .canEnqueue('generateReport', generateReportPayloadSchema)
  .exposeAsHttpEndpoint(
    'POST',
    'reports',
    'application/json',
    'utf-8',
    'application/json',
    'utf-8',
    { mode: 'async' },
  )
  .setCommandFunction(async function (context, payload) {
    const job = await context.queue.enqueue.generateReport({ reportId: payload.reportId })
    return job
  })
```

Use a durable QueueBridge before relying on the acceptance path in production.
Make enqueueing idempotent and persist or publish a result that the caller can
retrieve. Apply authentication, authorization, body-size, rate, and timeout
limits at the edge; never expose raw service errors or an administrative command
just because it already exists.

An async Hono projection requires the command result to retain a string `jobId`
and `queueName`; otherwise Hono returns `500` instead of `202`. The generated
HTTP client currently models an async route as the command output contract,
while Hono returns normalized acceptance metadata. Consume such routes through
an application-owned acceptance type until that generator mismatch is repaired.

| Declaration | What it establishes | Options, default, and important boundary |
| --- | --- | --- |
| [`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder) | The request-acceptance command owned by `reportV1Service`. | Keep `name` stable because it is the command target; use `eventName` only for a canonical success fact. The builder itself neither registers the command nor creates the `generateReport` queue. |
| [`addPayloadSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema) | The externally supplied `reportId` and its inferred handler input. | Omitted representation values retain prior values or resolve to JSON and UTF-8. Invalid input is rejected before guards and enqueueing, so an invalid report ID cannot create a job. |
| [`addOutputSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema) | The declared acceptance-result shape used by the command runtime and OpenAPI metadata. | Its optional representation values use the same defaults. Async Hono still requires a queue receipt containing string `jobId` and `queueName`; an incompatible result becomes a `500`, not a `202`. |
| [`canEnqueue(name, payloadSchema?, parameterSchema?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canenqueue) | The typed `context.queue.enqueue.generateReport(...)` capability available to this handler. | The queue name must be non-empty. Payload and parameter schemas make the handler call type-safe; this declaration does **not** create a queue or worker. Register those definitions separately in the service. |
| [`exposeAsHttpEndpoint(..., { mode: 'async' })`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#exposeashttpendpoint) | An accepted-work HTTP projection. Hono invokes the command, checks that its result is a queue receipt, and returns `202` with normalized job metadata. | All representation arguments before `{ mode: 'async' }` are optional; they are shown only to make the JSON/UTF-8 wire contract explicit. Omit them when the defaults are correct. Do not select `async` for work that actually completes during the request. |
| `context.queue.enqueue.generateReport(payload)` | A queue receipt with the provider-visible job reference used by the HTTP response. | Add an idempotency key/queue options when the business action can be retried, and use a durable QueueBridge for production. The queue and worker own delay, retry, lease, and result policies. |
| [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) | The short acceptance path; it should enqueue and return its receipt rather than perform the report generation inline. | A `202` means the queue accepted work, not that a report exists. Expose a status/result contract for completion. |

For the full queue, worker, result, and recovery lifecycle, continue with
[queues and workers](/handbook/framework/build-services/queues-and-workers/).
