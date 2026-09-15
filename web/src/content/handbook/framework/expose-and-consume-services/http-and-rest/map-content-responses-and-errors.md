---
title: Map content, responses, and errors
description: Understand how Hono parses requests, validates parameters, chooses response status, and renders safe failures.
order: 416
---

The command or stream schema remains the business contract. Hono owns only the
HTTP representation and forwards validated intent through EventBridge.

## Map the request

| Input | Hono behavior |
| --- | --- |
| `POST`, `PUT`, `PATCH` payload | Requires the declared content type, then parses JSON, form/multipart, or text. `maxRequestBodyBytes` applies before parsing. |
| `GET`, `DELETE` payload | Always `undefined`; model input as path/query parameters. |
| Parameter | Merges query, then path, then middleware `additionalParameter`; later values win. The definition's parameter schema validates the result. |
| Identity | Copies middleware `principalId` and `tenantId` to the PURISTA message. Payload/query identity is untrusted business data. |
| Trace | Extracts W3C trace context and reads/echoes `traceHeaderField` (default `x-trace-id`). |

If middleware adds `additionalParameter`, include those keys in the parameter
schema. A strict object schema correctly rejects undeclared injected fields.

## Map the successful response

| Result | HTTP response |
| --- | --- |
| Normal command value | `200` with the declared output content type. |
| `undefined`, `null`, or empty string | `204` with no body. |
| Async command returning `QueueEnqueueResult` | `202` with queue admission metadata. |
| Stream in `aggregate` mode | Final/aggregate JSON or the stream's handled error status. |
| Stream in `stream` mode | `200` SSE; client disconnect cancels the EventBridge stream handle. |

`addPayloadSchema(...)` and `addOutputSchema(...)` accept content type and
encoding defaults. `exposeAsHttpEndpoint(...)` can override them. A stream may
add safe static protocol headers with `setHttpResponseHeaders(...)`; Hono keeps
control of `content-type`, `cache-control`, and `connection`.

An asynchronous command must return a queue result with string `jobId` and
`queueName`; an invalid shape is an internal contract failure and becomes
`500`. An aggregate stream that closes without a complete or error control
frame currently returns `200` with `null`, so producers must always close with
a final value or error. Once SSE response headers and frames have started, a
later stream failure is sent as the stream's SSE error frame; it cannot be
replaced by an RFC 9457 HTTP response.

## Throw a handled error for a safe outcome

```ts title="Reject a known business condition"
import { HandledError, StatusCode } from '@purista/core'

if (transaction.status === 'settled') {
  throw new HandledError(
    StatusCode.Conflict,
    'A settled transaction cannot be changed',
    { transactionId: transaction.id },
  )
}
```

Hono renders a handled error with that status as RFC 9457
`application/problem+json` (or Markdown when negotiated). An unexpected error
is logged/traced and becomes a generic `500`; do not build custom JSON in every
route. Configure stable problem type URIs once:

```ts title="Configure problem details"
const serviceConfig = {
  problemDetails: { typeBaseUri: 'https://example.com/problems' },
}
```

Transport failures include `400` for an invalid body representation, `404` for
an unknown route, `413` for an oversized body, `501` when the EventBridge cannot
stream, and `503` while Hono is unavailable. Domain code should not reproduce
those transport checks.

Next: [generate OpenAPI contracts](/handbook/framework/expose-and-consume-services/http-and-rest/generate-openapi-contracts/).
