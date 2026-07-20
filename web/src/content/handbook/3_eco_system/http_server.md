---
title: Servers (HTTP & co)
description: The PURISTA HTTP server
order: 303000
---

# Servers

## Official servers

| name           | category                                                               | package   | documentation |
|---             |---                                                                     |---        |---        |
| Hono based server | HTTP server| [@purista/hono-http-server](/handbook/api/modules/_purista_hono-http-server/) | [Handbook](../2_building_business-logic/exposing_endpoints/rest_api_http_endpoints.md) |

## Quick start

```typescript
import { serve } from '@hono/node-server'
import { DefaultEventBridge } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

// Add your service
const myService = await myV1Service.getInstance(eventBridge)
await myService.start()

// Create and start the Hono HTTP service
const honoService = await honoV1Service.getInstance(eventBridge, {
  serviceConfig: {
    enableDynamicRoutes: false,
  },
})
honoService.registerService(myService)
await honoService.start()

// Open a network socket (Node.js — swap for Bun.serve or Deno.serve as needed)
serve({
  fetch: honoService.app.fetch,
  port: 3000,
})
```

## Request body limits

POST, PUT, and PATCH endpoints accept at most 1 MiB by default. The limit is
enforced before PURISTA parses JSON, form, or text input, including when a
client streams a request without a `Content-Length` header. Oversized requests
receive an RFC 9457 `413 Payload Too Large` response.

Set `maxRequestBodyBytes` explicitly for applications that need larger payloads:

```typescript
const honoService = await honoV1Service.getInstance(eventBridge, {
  serviceConfig: {
    maxRequestBodyBytes: 10 * 1024 * 1024, // 10 MiB
  },
})
```

This limit bounds a single request before parsing. Configure authentication,
rate limiting, timeouts, and deployment-level resource limits for broader
resource-exhaustion protection.

## Community servers

| name           | category                                                               | package   | documentation |
|---             |---                                                                     |---        |---        |

## When to use

- You need REST endpoints and OpenAPI over command definitions.
- You need SSE endpoints over stream definitions.
- You want transport concerns separated from business logic.
- You want runtime flexibility (Node.js, Bun, Deno).
- You want standardized HTTP error responses via RFC 9457 Problem Details.

## Common pitfalls

- assuming `honoV1Service.start()` also opens a network socket
- missing auth middleware/protection handlers
- not aligning command parameter schema with query/path params

## Checklist

- `@purista/hono-http-server` is installed
- routes are registered explicitly via `registerService(...)` or via dynamic mode
- health endpoint is enabled explicitly when needed (`enableHealth: true`)
- command endpoints are mapped to JSON responses
- framework-generated HTTP errors are exposed as `application/problem+json`
- clients can request `text/markdown` for the same normalized error details
- stream endpoints are mapped to `text/event-stream` (SSE) responses
- Hono server socket is explicitly started for your runtime
- auth, OpenAPI metadata, and graceful shutdown are configured

## Error responses

`@purista/hono-http-server` maps PURISTA framework errors to [RFC 9457 Problem Details](https://www.rfc-editor.org/rfc/rfc9457.html).

Default error response content type:

- `application/problem+json`

Optional negotiated representation:

- `text/markdown` when the client sends `Accept: text/markdown`

This applies to framework-generated HTTP errors such as:

- validation failures
- unsupported request content type
- route-not-found handling
- handled and unhandled command execution errors

OpenAPI output documents the canonical JSON error contract as `application/problem+json` and also declares the optional Markdown representation.

If you want dereferenceable problem `type` URIs, configure the Hono service with `problemDetails.typeBaseUri`.
Without that setting, the adapter uses `about:blank` instead of hardcoded framework URLs.

```typescript
const server = await honoV1Service.getInstance(eventBridge, {
  serviceConfig: {
    enableDynamicRoutes: false,
    problemDetails: {
      typeBaseUri: 'https://api.example.com/problems',
    },
  },
})
server.registerService(myService)
```
