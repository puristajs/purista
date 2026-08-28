---
title: Handle stream termination and failures
description: Stop work cooperatively when the caller cancels, throw terminal failures safely, and move durable work out of the connected-stream boundary.
order: 346
---

A stream ends with `complete`, `cancel`, or `error`. The runtime emits those
frames; the handler should write progress, record a successful final value, and
then return. Do not model a partial or failed operation as a completed final
payload.

## Handle cancellation cooperatively

| Situation | Correct response |
| --- | --- |
| Caller disconnects/cancels | Check `writer.cancelled`, stop expensive upstream work through `onCancel`, and return without more frames. |
| Work must finish after disconnect | Accept it through a queue and persist/query the result later. |
| Upstream stream is no longer useful | Call its `cancel(reason?)`, stop consuming, and clean up local work. |
| Client needs replay/resume | Store a durable result/progress model; do not promise stream-frame replay. |

Cancellation is cooperative. PURISTA marks the writer cancelled and runs
registered callbacks, but cannot abort your database, provider, or HTTP call
unless the handler wires its cancellation mechanism.

## Throw for terminal failure

```ts title="src/service/document/v1/stream/analyzeDocument/analyzeDocumentStreamBuilder.ts"
export const failureAwareAnalyzeDocumentStreamBuilder = analyzeDocumentStreamBuilder
  .setStreamFunction(async function (context, payload, _parameter, writer) {
    try {
      const result = await context.resources.analyzer.analyze(payload.documentId)
      if (writer.cancelled) return
      await writer.close(result)
    } catch (error) {
      context.logger.error({ err: error }, 'document analysis failed')
      throw error // Runtime emits the terminal error frame.
    }
  })
```

[`setStreamFunction(fn)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#setstreamfunction)
installs the bound stream handler. It does not turn a thrown error into a
retriable job: the active stream receives an error frame and the caller must
choose a durable queue workflow when retry or completion after disconnect is a
requirement.

`writer.fail(error)` emits an error frame but does **not** close the writer. If
the handler then returns, the runtime can auto-close and produce a completion
path. Prefer throwing for ordinary terminal failure. A `HandledError` is still
an error frame (marked handled), not a successful result.

## Keep retries and durability outside the stream

Retry only an operation that is safe to repeat. A connected stream has no
durable retry/replay/lease configuration on its builder; place long-lived,
retriable work in [queues and workers](/handbook/framework/build-services/queues-and-workers/) and stream only the connected caller’s current progress.

Next, [test a stream](/handbook/framework/build-services/streams/test-a-stream/) to prove cancellation and failure at the correct boundary.
