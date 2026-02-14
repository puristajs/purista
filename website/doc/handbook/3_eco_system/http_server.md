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

## Common pitfalls

- assuming `honoV1Service.start()` also opens a network socket
- missing auth middleware/protection handlers
- not aligning command parameter schema with query/path params

## Checklist

- `@purista/hono-http-server` is installed
- routes are registered via static services list or dynamic mode
- command endpoints are mapped to JSON responses
- stream endpoints are mapped to `text/event-stream` (SSE) responses
- Hono server socket is explicitly started for your runtime
- auth, OpenAPI metadata, and graceful shutdown are configured
