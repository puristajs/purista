---
order: 10
title: Logging
shortTitle: Logging
description: Logging in PURISTA typescript nodejs backend framework applications and how to use them.
tag:
  - logging
  - logger
  - pino
---

## Logging

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

`info` = general information like used port, service status and so on
`fatal` = if a service is unable to start at all
`error` = if some unexpected/unhandled error occurs like a command function is throwing
`warning` = if for example a http request fails because of input validation
`debug` = general framework flow information which should not be logged in production
`trace` = detailed raw data mainly of third party plugins

In production, log level `warn` is recommended.

::: info
Service instances will create a own logger 
:::

## Error tracking within the program

To allow a more flexible way of tracking, monitoring or alerting, you might want to use some external services like [sentry](https://sentry.io/) or you like to programmatically react on errors and issues.  
For example, automatically open a issue in your ticket system.

To allow a flexible and decoupled way, a service emits the following events:

- `handled-subscription-error` emitted when a subscription throws a HandledError
- `handled-command-error` emitted when a command throws a HandledError
- `unhandled-subscription-error` emitted when a subscription throws an error other than a HandledError
- `unhandled-command-error` emitted when a command throws an error other than a HandledError

This means, you can attach your logic like opening a issue in your ticket system, instead of deeply integrate it into your business logic.

### Events vs subscription

There is also the option to have a subscription for error messages. This only works for functions, but not for subscriptions, as they do not emit a response message. Also, the error handling should be close to the root cause, it works even when there is an issue with event bus, and it might be faster when it comes to alerting.

But, subscriptions can be the preferred way, if you like to build some (business) analytics like "hourly average of...".  
Because this way, you also get some decoupled and isolated solution.
