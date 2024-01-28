---
title: Logging
description: Logging in typescript backend framework PURISTA
order: 204010
---

# Logging

PURISTA provides logging as integral part.
Per default, [pino](https://getpino.io/) is used under the hood as logging library.

This means, during development you are able to use [pino-pretty](https://github.com/pinojs/pino-pretty) for better human readable console log output.

But you can in theory use any logging library. There is only the need to build a simple wrapper.
This wrapper should be a class which extends `Logger` from `@purista/core`. See `DefaultLogger.ts` in core package.

The logger is expected to log:

- serviceName
- serviceVersion
- serviceTarget (available logged in context of a command or subscription)
- principalId (if available)
- traceId
- spanId
- parentSpanId
- traceFlags

When messages are logged - the message payload will be removed to prevent leaking of data.

To log errors with stacktrace correctly, you should log them as `err`.

```typescript
logger.error({ err }, 'my own error message')
```

You **should not use** `traceId`, `spanId`, `parentId`, `parentSpanId`, `traceFlags` or `principalId` as property of the logging object. This might overwrite automatically added log information.

Available log levels are `info`, `fatal`, `error`, `warn`, `debug` and `trace`.

Internally, PURISTA tries to cover these use cases with different log levels:

- `info` = general information like used port, service status and so on
- `fatal` = if a service is unable to start at all
- `error` = if some unexpected/unhandled error occurs like a command function is throwing
- `warning` = if for example a http request fails because of input validation
- `debug` = general framework flow information which should not be logged in production
- `trace` = detailed raw data mainly of third party plugins

In production, log level `warn` is recommended.

::: info
Service instances will create a own logger
:::
