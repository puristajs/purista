---
title: Invoke, enqueue, emit, and consume
description: Declare every downstream command, stream, queue, or custom event before the stream handler uses it.
order: 343
---

Every outbound capability is declared on the builder. The declaration types the
context, provides a runtime allow-list, and lets direct tests expose only the
dependencies the handler actually owns.

## Choose the dependency boundary

| Need | Declare | Main consequence |
| --- | --- | --- |
| One bounded result now | [`canInvoke(...)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#caninvoke) | The connected stream waits for command availability and latency. |
| Progressive frames from another service | [`canConsumeStream(...)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#canconsumestream) | The handler must consume/cancel an upstream session deliberately. |
| Durable work that can complete later | [`canEnqueue(...)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#canenqueue) | Queue acceptance is not completion of the work. |
| An independent fact | [`canEmit(...)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#canemit) | Publication is separate from a database transaction. |

## Declare then use the capability

```ts title="src/service/search/v1/stream/searchUsers/searchUsersStreamBuilder.ts"
export const searchUsersStreamBuilder = searchV1ServiceBuilder
  .getStreamBuilder('searchUsers', 'Stream user search results')
  .canInvoke('Audit', '1', 'recordSearch', auditOutputSchema, auditPayloadSchema, auditParameterSchema)
  .canConsumeStream('Directory', '1', 'findUsers', directoryChunkSchema, directoryPayloadSchema, directoryParameterSchema, directoryFinalSchema)
  .canEnqueue('refreshIndex', refreshPayloadSchema, refreshParameterSchema)
  .canEmit('search.completed', searchCompletedSchema)
  .setStreamFunction(async function (context, payload, parameter, writer) {
    const upstream = await context.stream.Directory['1'].findUsers(payload, parameter)
    for await (const frame of upstream) {
      if (frame.payload.chunk) await writer.write(frame.payload.chunk)
    }

    await context.queue.enqueue.refreshIndex({ query: payload.query })
    await context.emit('search.completed', { query: payload.query })
  })
```

[`getStreamBuilder(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getstreambuilder)
creates this service-owned stream and [`setStreamFunction(...)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#setstreamfunction)
installs its bound handler. The four `can*` calls are declarations, not
transport calls: they make only these dependencies available through the
matching typed context namespace when the handler runs.

## Use each capability precisely

| Method | Parameters and validation | Context member and outcome |
| --- | --- | --- |
| [`canInvoke(service, version, target, outputSchema?, payloadSchema?, parameterSchema?)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#caninvoke) | All three address segments are required and non-empty. A supplied payload or parameter schema validates the outbound request before it leaves this service. A supplied output schema validates the reply; any mismatch is an error. | `context.service[service][version][target](payload, parameter)`. Use all three schemas for a versioned business contract; omit a schema only when that boundary is intentionally untyped. |
| [`canConsumeStream(service, version, target, chunkSchema?, payloadSchema?, parameterSchema?, finalSchema?, validateChunk = true, validateFinal = true)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#canconsumestream) | Request payload and parameter schemas validate before opening the upstream stream. Chunk/final validation defaults to `true` when the respective schema exists; setting either flag to `false` trusts that frame type and removes this consumer-side check. | An async-iterable session with `sessionId` and `cancel(reason?)`. Consume frames deliberately; cancellation is a request to stop upstream work, not proof it already stopped. |
| [`canEnqueue(queueName, payloadSchema?, parameterSchema?)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#canenqueue) | A non-empty queue name and optional payload/parameter schemas. They validate before the queue accepts a job. | `context.queue.enqueue[queueName](payload, parameter?, options?)` or `scheduleAt[queueName](runAt, payload, parameter?, options?)` returns acceptance metadata, never the worker’s final result. |
| [`canEmit(eventName, schema)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#canemit) | A non-empty event name and required payload schema. The payload validates before publishing. | `context.emit(eventName, payload, contentType?, contentEncoding?)`. JSON/UTF-8 are the defaults; use another media type only when subscribers deliberately share that contract. |

Every declared outbound call propagates the active trace, trusted principal,
and tenant identity through the Framework message. The handler must not replace
those identities with payload values.

### Choose queue options at the enqueue boundary

The third argument of `context.queue.enqueue[name](payload, parameter,
options)` accepts the following optional properties. `scheduleAt` accepts the
same options except `delayMs`, because its `runAt` controls the delay.

| Option | Use it when | Avoid it when |
| --- | --- | --- |
| `delayMs` | The job should become eligible after a bounded delay. | The caller needs a precise calendar time; use `scheduleAt` instead. |
| `idempotencyKey` | The bridge supports deduplication and the business action has a stable transport/delivery key. | Deriving a key from prompt text, a timestamp, or sensitive request data. |
| `headers` | A bridge or worker needs small, safe transport metadata. | Sending credentials, raw HTTP headers, personal data, or unbounded values. |
| `maxAttempts` | This individual job needs a stricter retry ceiling than the queue lifecycle. | Treating retries as exactly-once business execution. |
| `priority` | The selected queue bridge documents priority support and this work has an operational priority. | Assuming all adapters order jobs by this number. |
| `leaseTtlMs` | The selected bridge needs an initial visibility/lease duration for this job. | Guessing a value that is shorter than normal execution; use the queue lifecycle for the standard policy. |

`validateChunk` and `validateFinal` control only this consumer’s validation of
the upstream stream frames; they do not disable validation of this stream’s
own writer output. When cancellation makes upstream frames irrelevant, call
the upstream session’s `cancel(reason?)` and stop consuming.

Next, use [stream context and cancellation](/handbook/framework/build-services/streams/resources-stores-context-and-cancellation/) or [write a final result](/handbook/framework/build-services/streams/write-chunks-and-complete/).

For signatures, see [StreamDefinitionBuilder](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/).
