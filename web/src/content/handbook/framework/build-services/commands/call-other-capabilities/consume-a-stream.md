---
title: Consume a stream
description: Declare a progressive upstream dependency, validate its frames, and cancel the session deliberately when the command no longer needs it.
order: 326
---

Use a stream from a command only when the command must stay connected while progressive chunks arrive. If the caller can receive a final answer later, enqueue work instead; that avoids holding the command open for the stream session.

## Declare and consume the stream

```ts title="src/service/report/v1/command/summarizeReport/summarizeReportCommandBuilder.ts"
export const summarizeReportCommandBuilder = reportV1ServiceBuilder
  .getCommandBuilder('summarizeReport', 'Summarize a generated report')
  .canConsumeStream(
    'Report',
    '1',
    'generateReport',
    reportChunkSchema,
    reportRequestSchema,
    reportParameterSchema,
    reportFinalSchema,
  )
  .addPayloadSchema(summarizeReportPayloadSchema)
  .addParameterSchema(summarizeReportParameterSchema)
  .addOutputSchema(summarizeReportOutputSchema)
  .setCommandFunction(async function (context, payload) {
    const report = await context.stream.Report['1'].generateReport({ reportId: payload.reportId }, {})
    const chunks: string[] = []
    let completed = false

    try {
      for await (const frame of report) {
        if (frame.payload.chunk) chunks.push(frame.payload.chunk.text)
        if (frame.payload.final) completed = true

        if (chunks.join('').length >= 4_000) break
      }
    } finally {
      if (!completed) await report.cancel('summary has enough source text')
    }

    return { text: chunks.join('') }
  })
```

`getCommandBuilder(...)`, the
[`add…Schema(...)` contract methods](/handbook/framework/build-services/commands/create-and-validate/#understand-the-builder-methods),
and [`setCommandFunction(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction)
define the local command exactly as they do for a non-streaming operation.
`canConsumeStream(...)` adds the upstream stream client to that handler; it
does not turn this command into a stream endpoint. See [Create and validate a
command](/handbook/framework/build-services/commands/create-and-validate/) for
the local validation and handler contract.

The local contract uses [`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder), [`addPayloadSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema), [`addParameterSchema(schema)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema), and [`addOutputSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema). [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) installs the non-arrow, service-bound implementation. None of those calls declares or validates the upstream stream; the `canConsumeStream(...)` declaration does.

## Understand [`canConsumeStream(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canconsumestream)

| Argument | Default | Meaning |
| --- | --- | --- |
| `serviceName`, `serviceVersion`, `serviceTarget` | Required | Non-empty address of the upstream stream. |
| `chunkSchema`, `payloadSchema`, `parameterSchema`, `finalSchema` | Optional | Type and validate frames/request values when provided. |
| `validateChunk` | `true` | Disable only when a deliberate boundary already validates every chunk. |
| `validateFinal` | `true` | Disable only when a deliberate boundary already validates the final frame. |

The returned handle exposes `sessionId`, an async iterator, and
`cancel(reason?)`. Always cancel in `finally` when the consumer may break early
or throw. Cancellation is cooperative and adapter-mediated; do not treat it as
proof that an upstream side effect never happened.

Runtime frames carry `payload.frameType`, `sequence`, optional `chunk`, optional
`final`, optional `error`, and an optional reason. The current typed
`canConsumeStream(...)` proxy exposes only `chunk?` and `final?`, so use their
presence in a typed handler and let the iterator surface stream errors. Chunk
and final schemas validate incoming values when their flags are not `false`,
but the runtime yields the original frame value; it does not replace it with a
schema-coerced/defaulted value. Do not rely on coercion or defaults in those
frame schemas.

Next: [Invoke another command](/handbook/framework/build-services/commands/call-other-capabilities/invoke-command/) or use a service-owned [stream](/handbook/framework/build-services/streams/).

For the exact signature, see [`canConsumeStream`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canconsumestream).
