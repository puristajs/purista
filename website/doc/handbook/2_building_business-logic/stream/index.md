---
title: Stream
description: Add streaming functions with typed chunks, final payload aggregation and SSE exposure.
order: 202500
---

# Stream

A stream is a long-running request/response function that returns multiple frames instead of a single payload.

Use streams when you need incremental delivery, token/chunked responses, progress updates, or server-side events.

Key properties:

- request input is validated like a command (`payload` and `parameter`)
- response is delivered as frames (`start`, `chunk`, `complete`, `error`, `cancel`)
- optional final aggregation can emit a custom event
- can be exposed as HTTP endpoint with `text/event-stream` (SSE)

## Reliability notes

- stream sessions are correlated by `correlationId`
- consumers must handle terminal frames (`complete`, `error`, `cancel`)
- cancellation is a normal control path, not an exceptional runtime crash
- per-chunk validation can be disabled for performance, but keep schemas for type safety

## What to read next

- [The stream builder](./the-stream-builder.md)
- [Exposing endpoints](../exposing_endpoints/rest_api_http_endpoints.md)
- [Subscription builder](../subscription/the-subscription-builder.md)
