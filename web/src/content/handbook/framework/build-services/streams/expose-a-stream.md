---
title: Expose a stream
description: Declare a secure HTTP stream projection, choose incremental SSE or aggregate response, and keep server topology separate from builder metadata.
order: 345
---

The stream builder declares projection metadata. It does not start Hono,
register a route, authenticate a request, or make an EventBridge stream-capable.
Compose the Hono service and follow the [HTTP runtime architecture](/handbook/framework/expose-and-consume-services/http-and-rest/runtime-architecture/) for distributed versus monolith startup.

## Declare the endpoint

```ts title="src/service/document/v1/stream/analyzeDocument/analyzeDocumentStreamBuilder.ts"
export const exposedAnalyzeDocumentStreamBuilder = analyzeDocumentStreamBuilder
  .exposeAsHttpStreamEndpoint('POST', 'documents/analyze')
  .setHttpStreamingMode('stream')
  .setHttpStreamProtocol('purista')
  .setOpenApiSummary('Analyze a document progressively')
```

[`exposeAsHttpStreamEndpoint(method, path, contentTypeRequest?,
contentEncodingRequest?)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#exposeashttpstreamendpoint) records route and request media metadata. Request
media defaults from the input schema metadata, then JSON/UTF-8; it does not
perform request schema validation itself. The builder initially records an SSE
response, but `getDefinition()` resolves the effective response content type
from the selected mode: `text/event-stream` for `stream` and
`application/json` for `aggregate`.

## Choose the response and security metadata

| Method | Default | What it changes |
| --- | --- | --- |
| [`setHttpStreamingMode('stream' \| 'aggregate')`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#sethttpstreamingmode) | `'stream'` | `stream` projects `text/event-stream`; `aggregate` collects the terminal result into JSON. Aggregate is not durability. |
| [`setHttpStreamProtocol(protocol, documentationUrl?)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#sethttpstreamprotocol) | A protocol name and optional public specification URL | Documents the stream protocol/OpenAPI contract. The method has no argument default; when an HTTP endpoint exists and no protocol was set, generated metadata uses `purista`. Use a meaningful, stable protocol name. |
| [`makeEndpointPublic()`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#makeendpointpublic), [`enableHttpSecurity(enabled = true)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#enablehttpsecurity) | Endpoint is secure | `makeEndpointPublic()` is shorthand for `enableHttpSecurity(false)`. Both update the one `isSecure` flag consumed by OpenAPI metadata and Hono's protection hook. |
| [`setHttpResponseHeaders(headers)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#sethttpresponseheaders) | No custom headers | Adds validated static protocol headers. Server-managed `content-type`, `cache-control`, and `connection` headers are rejected. |
| [`setOpenApiSummary`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#setopenapisummary), [`addOpenApiTags`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#addopenapitags), [`setOpenApiOperationId`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#setopenapioperationid), [`addOpenApiErrorStatusCodes`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#addopenapierrorstatuscodes), [`addQueryParameters`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#addqueryparameters) | Summary/operation ID begin with stream name; lists begin empty | Adds documentation/routing metadata, not authorization or query validation. |

Hono must be composed separately, and the service that owns the stream needs a
stream-capable EventBridge. Otherwise service registration fails with
`UnhandledError(501, 'stream "<name>" cannot be registered because <bridge>
does not support streams')`. Its protection hook, request limits,
rate limits, route collision behavior, disconnect propagation, and server
readiness belong to the HTTP server configuration—not this builder chain.
Endpoints are marked protected by default, but protection is effective only
after the Hono service configures a protection middleware/handler; follow
[authentication and authorization](/handbook/framework/secure-and-operate/security/authentication-and-authorization/).

For `stream` mode, Hono consumes the internal `open`, `start`, `close`, and
`complete` transport-control frames. A browser receives chunk and error SSE
events (or the selected protocol's passthrough events), then the connection
closes; it does not receive a `complete` SSE event. Use the connection close or
a documented application chunk as the client completion signal. For
`aggregate` mode, Hono returns the final JSON payload after completion. If a
stream ends without a complete or error frame—for example, an unhandled
cancellation edge—the current aggregate projection returns `200` with `null`.
Exercise cancellation and terminal behavior in an HTTP integration test before
making aggregate HTTP a public contract.

Next, [configure HTTP and REST](/handbook/framework/expose-and-consume-services/http-and-rest/) or [handle stream termination and failures](/handbook/framework/build-services/streams/termination-and-failures/).

For the builder API, see [StreamDefinitionBuilder](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/).
