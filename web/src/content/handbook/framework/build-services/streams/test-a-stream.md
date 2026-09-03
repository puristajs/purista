---
title: Test a stream
description: Prove direct handler logic, deterministic stream runtime behavior, and the selected adapter/HTTP boundary separately.
order: 347
---

Streams need three test boundaries. A direct writer mock is fast but does not
run the runtime lifecycle. The deterministic harness exercises the service
flow. A real HTTP/adapter test proves only the selected deployment boundary.

| Boundary | Proves | Does not prove |
| --- | --- | --- |
| `createStreamContextMock` | Direct handler decisions, declared context stubs, captured chunks/final/error, and local cancellation callbacks | Builder/runtime validation, guards, auto-close, frames, final event, registration, or adapter behavior. |
| `createStreamTestHarness` | Service instance creation, direct stream registration/execution, and—when it owns its EventBridge mock—frame ordering, writer validation, guards, auto-close, cancellation, and terminal result flow | Service startup/readiness, a production broker/HTTP server guarantee, or captured frames when you supply your own EventBridge. |
| Selected HTTP/adapter integration | Hono projection, disconnect propagation, and documented server/bridge behavior | Nondeterministic provider/model quality. |

## Test handler decisions with a capture writer

`createStreamContextMock(builder, { payload, parameter, sandbox?, resources?,
message? })` requires the payload and parameter values. It returns
`{ context, writer, stubs, chunks, finalValue, failedWith, cancel }`; the partial
`message` overrides a generated `StreamOpenRequest`.

```ts title="Direct stream-handler test"
import { createStreamContextMock } from '@purista/core'
import { expect, test } from 'vitest'
import { analyzeDocumentStreamBuilder } from './analyzeDocumentStreamBuilder.js'

test('records direct handler output', async () => {
  const mocked = createStreamContextMock(analyzeDocumentStreamBuilder, {
    payload: { documentId: '8c4de89e-aa58-47cd-8d6b-b99997c73a32' },
    parameter: { requestId: 'd1002143-4d6d-4f06-9384-3d27682b2f52' },
  })

  await analyzeDocumentStreamBuilder.getStreamFunction().call(
    {} as never,
    mocked.context,
    { documentId: '8c4de89e-aa58-47cd-8d6b-b99997c73a32' },
    { requestId: 'd1002143-4d6d-4f06-9384-3d27682b2f52' },
    mocked.writer,
  )

  expect(mocked.chunks).toEqual([
    { stage: 'extracting', progress: 25 },
    { stage: 'classifying', progress: 75 },
  ])
  expect(mocked.finalValue).toEqual({
    documentId: '8c4de89e-aa58-47cd-8d6b-b99997c73a32',
    status: 'complete',
  })
})
```

This helper records what the raw handler asked the writer to do. It does not
run builder/runtime validation, guards, auto-close, frame construction, or
final-event publication.

## Capture a deterministic runtime result

```ts title="src/service/document/v1/stream/analyzeDocument/analyzeDocumentStreamBuilder.test.ts"
import { createStreamTestHarness } from '@purista/core'
import { describe, expect, test } from 'vitest'
import { documentV1ServiceBuilder } from '../../documentV1ServiceBuilder.js'
import { analyzeDocumentStreamBuilder } from './analyzeDocumentStreamBuilder.js'

describe('analyzeDocument stream', () => {
  test('emits ordered progress and a final result', async () => {
    const harness = await createStreamTestHarness(documentV1ServiceBuilder, analyzeDocumentStreamBuilder)
    try {
      const result = await harness.run({
        payload: { documentId: '8c4de89e-aa58-47cd-8d6b-b99997c73a32' },
        parameter: { requestId: 'd1002143-4d6d-4f06-9384-3d27682b2f52' },
      })

      expect(result.chunks).toEqual([
        { stage: 'extracting', progress: 25 },
        { stage: 'classifying', progress: 75 },
      ])
      expect(result.final).toEqual({
        documentId: '8c4de89e-aa58-47cd-8d6b-b99997c73a32',
        status: 'complete',
      })
    } finally {
      await harness.destroy()
    }
  })
})
```

The harness creates a service instance, directly registers the selected stream,
and executes it; it does not call `service.start()`. Without an `eventBridge`
option it owns an EventBridge mock and captures emitted frames in `result`.
With a supplied bridge, exercise that bridge separately—the helper cannot
capture frames in its returned `frames` array. Always call `destroy()` to
release the service and any helper-owned bridge.

## Cover decision paths

| Case | Expected evidence |
| --- | --- |
| Cancellation during work | No later chunks/final; registered cleanup runs. |
| Invalid chunk/final output | Terminal error path, not `complete`. |
| Before/after guard failure | Handler/final event is skipped as appropriate; error path is captured. |
| Upstream stream failure | Handler cancels/stops deliberately and throws/returns the chosen outcome. |
| HTTP aggregate or SSE projection | A selected Hono integration test proves that transport’s behavior. |

Do not use a live remote provider response or timing as a deterministic stream
assertion. Keep this test focused on the stream lifecycle.

For helper signatures, see [createStreamContextMock](/handbook/api/functions/_purista_core.createStreamContextMock/) and [createStreamTestHarness](/handbook/api/functions/_purista_core.createStreamTestHarness/).
