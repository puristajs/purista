---
title: Map commands, streams, queues, and agents
description: Project each PURISTA capability through the HTTP shape that matches its completion and delivery semantics.
order: 414
---

Hono creates routes from command and stream metadata. Queues and mounted Harness
targets do not become public routes automatically; expose a normal command or
stream that owns admission, authorization, and the public schema.

| Framework capability | HTTP shape | Builder boundary |
| --- | --- | --- |
| Command | One request and one final response | `exposeAsHttpEndpoint(...)` |
| Queued work | A command returns queue admission; Hono maps it to `202` | `exposeAsHttpEndpoint(..., { mode: 'async' })` and `canEnqueue(...)` |
| Stream | SSE frames or one aggregate JSON result | `exposeAsHttpStreamEndpoint(...)` and `setHttpStreamingMode(...)` |
| Mounted Harness agent/workflow | A normal command for aggregate output or normal stream for live output | `canInvokeAgent(...)` / `canInvokeWorkflow(...)` on that wrapper |
| Subscription or schedule | No direct request route | Expose a command that represents the caller's intent; keep reactions/triggers internal |

## Expose a synchronous command

```ts title="src/service/transaction/v1/command/getTransaction/getTransactionCommandBuilder.ts"
export const getTransactionCommandBuilder = transactionV1ServiceBuilder
  .getCommandBuilder('getTransaction', 'Return one transaction')
  .addPayloadSchema(z.undefined())
  .addParameterSchema(z.object({ transactionId: z.string().uuid() }))
  .addOutputSchema(transactionSchema)
  .exposeAsHttpEndpoint('GET', 'transactions/:transactionId')
  .setCommandFunction(async function (context, _payload, parameter) {
    return context.resources.transactions.getById(parameter.transactionId)
  })
```

[`ServiceBuilder.getCommandBuilder(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder)
creates the definition. The command declares its
[`payload`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema),
[`parameter`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema),
and
[`output`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema)
schemas, projects them through
[`exposeAsHttpEndpoint(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#exposeashttpendpoint),
and installs the business handler with
[`setCommandFunction(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction).

Hono prepends `apiMountPath` and `v<serviceVersion>`, so the default route is
`GET /api/v1/transactions/:transactionId`.

## Return queue acceptance

```ts title="src/service/statement/v1/command/requestStatement/requestStatementCommandBuilder.ts"
const queueEnqueueResultSchema = z.object({
  jobId: z.string(),
  queueName: z.string(),
  scheduledAt: z.number().optional(),
})

export const requestStatementCommandBuilder = statementV1ServiceBuilder
  .getCommandBuilder('requestStatement', 'Queue statement generation')
  .addPayloadSchema(requestStatementSchema)
  .addParameterSchema(z.undefined())
  .addOutputSchema(queueEnqueueResultSchema)
  .canEnqueue('generateStatement', generateStatementPayloadSchema, z.undefined())
  .exposeAsHttpEndpoint(
    'POST',
    'statements',
    undefined,
    undefined,
    undefined,
    undefined,
    { mode: 'async' },
  )
  .setCommandFunction(async function (context, payload) {
    return context.queue.enqueue.generateStatement(payload)
  })
```

The queue wrapper uses
[`getCommandBuilder(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder),
the command
[`payload`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema),
[`parameter`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema),
and
[`output`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema)
schemas, and
[`canEnqueue(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canenqueue)
to make the typed queue client available in the
[`handler`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction).
[`exposeAsHttpEndpoint(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#exposeashttpendpoint)
sets the asynchronous HTTP projection; it does not execute the worker.

The command still validates and enqueues. Hono requires a `QueueEnqueueResult`
and returns `202` with `jobId`, optional `runId`, `status: 'queued'`, queue
name, and `scheduledAt`. The response confirms admission, not completion.

## Expose progressive output

```ts title="src/service/knowledge/v1/stream/answerQuestion/answerQuestionStreamBuilder.ts"
export const answerQuestionStreamBuilder = knowledgeV1ServiceBuilder
  .getStreamBuilder('answerQuestion', 'Stream an answer')
  .addPayloadSchema(questionSchema)
  .addParameterSchema(z.undefined())
  .addChunkSchema(answerChunkSchema)
  .addFinalSchema(answerResultSchema)
  .exposeAsHttpStreamEndpoint('POST', 'knowledge/answer')
  .setHttpStreamingMode('stream')
  .setStreamFunction(async function (context, payload, _parameter, writer) {
    // Produce validated chunks and a validated final result.
  })
```

[`ServiceBuilder.getStreamBuilder(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getstreambuilder)
creates the stream. Its
[`payload`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#addpayloadschema),
[`parameter`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#addparameterschema),
[`chunk`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#addchunkschema),
and
[`final-result`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#addfinalschema)
schemas validate every boundary.
[`exposeAsHttpStreamEndpoint(...)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#exposeashttpstreamendpoint)
declares the route,
[`setHttpStreamingMode(...)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#sethttpstreamingmode)
selects aggregate or SSE projection, and
[`setStreamFunction(...)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#setstreamfunction)
installs the producer.

Use `aggregate` when an HTTP caller needs only the final result. Use `stream`
for SSE and cancel the EventBridge stream when the browser disconnects. For AI
SDK UI Message Stream v1, declare that protocol and its response header on the
stream builder; do not invent a PURISTA browser protocol.

Mounted Harness targets remain address-first EventBridge capabilities. A
wrapper command or stream is the public application contract, not a same-process
shortcut to the agent definition.

Next: [map content, responses, and errors](/handbook/framework/expose-and-consume-services/http-and-rest/map-content-responses-and-errors/).
