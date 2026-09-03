---
title: Handle stream termination and failures
description: Stop work cooperatively when the caller cancels, throw terminal failures safely, and move durable work out of the connected-stream boundary.
order: 346
---

The runtime frame set is `start`, `chunk`, `heartbeat`, `complete`, `cancel`,
and `error`. A successful stream ends with `complete`; cancellation ends with
`cancel`; a thrown failure ends with `error`. The handler should write progress,
record a successful final value, and then return. Do not model a partial or
failed operation as a completed final payload.

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

The cancellation callback runs when the service receives the control message,
which can be while the handler is still awaiting work. The runtime waits for
the handler to return before it emits `cancel`. It then returns immediately:
after guards do not run, no final event is published, and no `complete` frame
follows.

## Throw for terminal failure

```ts title="src/service/document/v1/stream/analyzeDocument/analyzeDocumentStreamBuilder.ts"
export const failureAwareAnalyzeDocumentStreamBuilder = analyzeDocumentStreamBuilder
  .setStreamFunction(async function (context, payload, _parameter, writer) {
    const result = await context.resources.analyzer.analyze(payload.documentId).catch(error => {
      context.logger.error({ err: error }, 'document analysis failed')
      throw error // Runtime emits the terminal error frame.
    })

    if (writer.cancelled) return
    // Keep writer validation outside the provider catch so a contract failure
    // is not logged as an analyzer failure.
    await writer.close({ documentId: result.documentId, status: 'complete' })
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

For terminal frame and writer types, see [StreamWriter](/handbook/api/interfaces/_purista_core.StreamWriter/) and [StreamDefinitionBuilder](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/).
