---
title: Use stream resources, stores, context, and cancellation
description: Use the stream handler’s declared context safely and stop upstream work cooperatively when the connected caller cancels.
order: 344
---

The handler receives `async function (context, payload, parameter, writer)`.
`context.message` is the immutable original EventBridge message; `payload` and
`parameter` reflect the stream-open boundary and must be treated defensively as
described in [create and validate a stream](/handbook/framework/build-services/streams/create-and-validate/).

## Read the declaration-to-context map

| Context member | Available when | Use it for |
| --- | --- | --- |
| `resources`, stores, logger, metrics, traces | The application/service provides them | Local business work, configuration/state/secret access, and safe diagnostics. |
| `service` | The builder declared `canInvoke(...)` | Typed command calls. |
| `stream` | The builder declared `canConsumeStream(...)` | Typed upstream sessions. |
| `queue` | The builder declared `canEnqueue(...)` | Typed enqueue and schedule calls. |
| `emit` | The builder declared `canEmit(...)` | Typed custom events. |
| `writer` | Every stream handler | Chunk writes, final value, cancellation signal, and cancellation callbacks. |

## Cooperate with cancellation

Cancellation marks `writer.cancelled` and invokes registered `onCancel`
callbacks. It cannot automatically abort a database request, HTTP call, model
request, or upstream stream—you own that cleanup.

```ts title="src/service/document/v1/stream/analyzeDocument/analyzeDocumentStreamBuilder.ts"
const cancellableAnalyzeDocumentStreamBuilder = analyzeDocumentStreamBuilder
  .setStreamFunction(async function (context, payload, _parameter, writer) {
    const controller = new AbortController()
    writer.onCancel(() => controller.abort())

    const stages = await context.resources.analyzer.analyze(payload.documentId, { signal: controller.signal })
    for (const stage of stages) {
      if (writer.cancelled) return
      await writer.write(stage)
    }

    await writer.close({ documentId: payload.documentId, status: 'complete' })
  })
```

[`setStreamFunction(fn)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#setstreamfunction)
requires a non-arrow function so the Framework can bind the owning service as
`this`. Its four arguments are the typed context, open payload, open
parameters, and writer; cancellation is visible only through that writer.

Check `writer.cancelled` between expensive steps, cancel upstream work in an
`onCancel` callback, and return without emitting later frames. Keep a result
that must survive this cancellation in a queue/state workflow, not this stream.
Because this definition has a domain final schema, the non-cancelled path
closes explicitly with that shape; returning normally without it would make
the default chunk aggregate fail final validation.

Next, [handle termination and failures](/handbook/framework/build-services/streams/termination-and-failures/) or [test a stream](/handbook/framework/build-services/streams/test-a-stream/).

For the context/writer contracts, see [StreamFunctionContext](/handbook/api/types/_purista_core.StreamFunctionContext/) and [StreamWriter](/handbook/api/interfaces/_purista_core.StreamWriter/).
