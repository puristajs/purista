---
title: Servers (HTTP & co)
description: The PURISTA HTTP server
order: 303000
---

# Servers

## Official servers

| name           | category                                                               | package   | documentation |
|---             |---                                                                     |---        |---        |
| Hono based server | HTTP server| [@purista/hono-http-server](../../api/@purista/hono-http-server/README.md) | [Handbook](../2_building_business-logic/exposing_endpoints/rest_api_http_endpoints.md) |

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
- routes are registered via static services list or dynamic mode
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
