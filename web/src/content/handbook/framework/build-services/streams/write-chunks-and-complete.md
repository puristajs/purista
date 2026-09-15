---
title: Write chunks and complete the stream
description: Emit validated progress frames, choose an explicit or aggregate final value, and publish a final event only after successful completion.
order: 342
---

Use `writer.write` for each visible progress value and `writer.close` for the
successful final value. The runtime owns the terminal `complete` frame; do not
manufacture protocol frames in the handler.

## Validate each result boundary

```ts title="src/service/document/v1/stream/analyzeDocument/analyzeDocumentStreamBuilder.ts"
import { documentV1ServiceBuilder } from '../../documentV1ServiceBuilder.js'
import {
  documentV1AnalyzeDocumentChunkPayloadSchema,
  documentV1AnalyzeDocumentFinalPayloadSchema,
  documentV1AnalyzeDocumentInputParameterSchema,
  documentV1AnalyzeDocumentInputPayloadSchema,
} from './schema.js'

export const analyzeDocumentStreamBuilder = documentV1ServiceBuilder
  .getStreamBuilder('analyzeDocument', 'Stream document analysis progress')
  .addPayloadSchema(documentV1AnalyzeDocumentInputPayloadSchema)
  .addParameterSchema(documentV1AnalyzeDocumentInputParameterSchema)
  .addChunkSchema(documentV1AnalyzeDocumentChunkPayloadSchema) // validation defaults to true
  .addFinalSchema(documentV1AnalyzeDocumentFinalPayloadSchema) // validation defaults to true
  .setStreamFunction(async function (_context, payload, _parameter, writer) {
    await writer.write({ stage: 'extracting', progress: 25 })
    if (writer.cancelled) return

    await writer.write({ stage: 'classifying', progress: 75 })
    if (writer.cancelled) return

    await writer.close({ documentId: payload.documentId, status: 'complete' })
  })
```

[`getStreamBuilder(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getstreambuilder)
creates the service-owned stream. The final definition declares its open
request with
[`addPayloadSchema(...)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#addpayloadschema)
and
[`addParameterSchema(...)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#addparameterschema)
before declaring producer output.

[`addChunkSchema(schema, validateChunks = true)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#addchunkschema)
and [`addFinalSchema(schema, validateFinal = true)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#addfinalschema)
make the writer values typed and enable producer-side validation by default.
[`setStreamFunction(fn)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#setstreamfunction)
binds this non-arrow handler to its service. Disable either validation switch
only at a separately verified boundary where the producer already guarantees
the exact contract; it removes a local safety check, not a transport limit.

`writer.write(chunk)` validates and emits one chunk unless cancellation has
already happened, in which case it is a no-op. `writer.close(final?)` records
only its first value. The call validates the resolved final value and records
it, but does not flush a `complete` frame. After the handler returns, the runtime
runs after guards, emits any configured final event, then emits `complete`.
`close` is not a write lock: a later `writer.write(...)` can still emit a chunk,
but it is not included in the final aggregate already recorded. Treat `close`
as terminal and return immediately after it.

An invalid chunk throws `UnhandledError(500, 'stream chunk output validation
failed')` from `writer.write(...)`; an invalid final value throws the analogous
`stream final output validation failed` error from `writer.close(...)`. Do not
catch and discard either error as an ordinary provider failure. Let the runtime
emit the terminal error frame.

## Choose explicit final or aggregation

[`enableChunkAggregation(enabled = true)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#enablechunkaggregation) is on by default. If the handler
returns without a final value, it produces `{ chunkCount, chunks }`; disabling
it leaves that implicit final `undefined`. Aggregation buffers chunks in the
service process, so use an explicit final for unbounded/large streams. Neither
mode makes results durable or resumable. When `addFinalSchema(...)` is present,
call `writer.close(final)` with a value that matches that schema. The default
aggregate object is validated as the final value and normally fails a
domain-specific final schema.

## Publish a final business event

[`setFinalEventName(eventName)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#setfinaleventname) (or the optional third [`getStreamBuilder`](/handbook/api/classes/_purista_core.ServiceBuilder/#getstreambuilder)
argument) publishes a custom EventBridge event only when a final value exists,
after successful after guards and immediately before `complete`. It is not
`context.emit`, it is not an outbox transaction, and it does not wait for a
subscriber to finish.

Use `canEmit` and `context.emit` for a different business fact produced during
the handler; see [invoke, enqueue, emit, and consume](/handbook/framework/build-services/streams/invoke-enqueue-emit-and-consume/).

Next, handle [termination and failures](/handbook/framework/build-services/streams/termination-and-failures/) before exposing the stream to clients.

For the writer and definition contracts, see [StreamWriter](/handbook/api/interfaces/_purista_core.StreamWriter/) and [StreamDefinitionBuilder](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/).
