# HTTP/SSE Exposure Model (Draft)

Goal: streams should be exposable via HTTP/HTTPS similarly to commands, but the response is a stream (SSE) instead of a single JSON response.

## SSE basics we need to align on

- SSE is typically `text/event-stream`.
- The browser `EventSource` API is GET-only.
- If we want POST semantics (payload body), we can still return `text/event-stream`, but the client must use `fetch()` streaming, not `EventSource`.

## Recommended support in Purista (v1)

Support both, but with clear constraints:

1. `GET` stream endpoint:
   - params only (query string)
   - best compatibility with `EventSource`
2. `POST` stream endpoint:
   - payload + params
   - uses `fetch()` streaming client (not `EventSource`)

We should not block other HTTP verbs at the type level (to avoid surprises), but the docs and defaults should strongly guide to GET/POST.

## StreamBuilder HTTP metadata

Mirror `CommandDefinitionBuilder.exposeAsHttpEndpoint()` but force response content type default to `text/event-stream` and disable response body encoding expectations.

Draft:

```ts
exposeAsHttpStreamEndpoint(
  method: 'GET' | 'POST',
  path: string,
  contentTypeRequest?: ContentType,       // defaults like commands (application/json)
  contentEncodingRequest?: string,        // defaults like commands (utf-8)
)
```

Open questions:
- Do we also support `PUT/PATCH` streams for non-browser clients? If yes, the implementation is identical to POST with fetch streaming.

## OpenAPI notes

- OpenAPI can describe SSE but tooling support varies.
- We should declare:
  - response content: `text/event-stream`
  - schema of each SSE event payload (frame envelope vs chunk payload)

## OpenAPI alignment with current Purista behavior

Current behavior:
- Commands expose HTTP metadata via `HttpExposedServiceMeta`.
- HTTP servers collect these definitions and generate OpenAPI by iterating `routeDefinitions`.

Streaming should follow the same shape:
- stream exposure must include an `openApi` object (summary/description/tags/query/security/operationId).
- stream exposure must also include `inputPayload` / `parameter` schemas where applicable.

Response modeling proposal:
- success response `200` with `content-type: text/event-stream`
- schema for the stream is a *frame* object (start/chunk/complete/error/cancel/heartbeat)
- errors are still returned as standard JSON error responses if they occur before the stream starts (handshake).

## Payload/params parity with commands

Streams should share the same model as commands:
- `addPayloadSchema(...)` for payload validation and typing
- `addParameterSchema(...)` for params validation and typing
- query parameter definitions for HTTP exposure (like commands)

## Error handling over SSE

We need a consistent wire protocol:
- send an `error` frame/event (typed) and then close the connection
- optionally include `correlationId`/`traceId` in SSE fields

## Cancel over SSE

If the client disconnects (or explicitly cancels), the server should:
- stop producing as soon as possible
- treat it as a terminal `cancel` (not an `error`)
- cleanup server-side session resources

## Final aggregation over SSE

If chunk aggregation is enabled:
- the final aggregate can be sent as:
  - a final SSE `event: complete` with aggregate payload, or
  - a final normal `chunk` followed by `complete`

For DX, prefer explicit `complete` event carrying the final aggregate when enabled.
