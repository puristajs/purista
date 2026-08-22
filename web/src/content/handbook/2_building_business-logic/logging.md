---
title: Logging
description: Logging in typescript backend framework PURISTA
order: 204010
---

# Logging

PURISTA provides logging as integral part.
By default, [pino](https://getpino.io/) is used under the hood as logging library.

This means, during development you are able to use [pino-pretty](https://github.com/pinojs/pino-pretty) for better human readable console log output.

But you can in theory use any logging library. There is only the need to build a simple wrapper.
This wrapper should be a class which extends `Logger` from `@purista/core`. See `DefaultLogger.ts` in core package.

The logger is expected to log:

- serviceName
- serviceVersion
- serviceTarget (available logged in context of a command or subscription)
- principalId (if available)
- tenantId (if available)
- traceId (custom traceId)
- OpenTelemetry traces

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
Service instances will create their own logger.
:::

## Pino and OpenTelemetry

PURISTA's default logger (pino) and OpenTelemetry tracing are complementary, not competing:

- **Pino** emits structured JSON log lines. Each line automatically includes `traceId`, `spanId`, and other context fields so log entries can be correlated with distributed traces.
- **OpenTelemetry** spans capture timing, status codes, and errors as trace data sent to your configured exporter (Jaeger, OTLP, etc.).

When you pass a `spanProcessor` through service-owned `observability` before an
event bridge starts, PURISTA attaches OTel context to every message it
processes. That same context is available to the logger, which writes it into
every log line emitted during that request.

This means you can:

1. Search logs by `traceId` in your log aggregator (Grafana Loki, Elasticsearch, CloudWatch).
2. Open the matching trace in your tracing backend (Jaeger, Grafana Tempo, Zipkin).
3. Correlate exactly which log lines belong to which distributed operation.

```typescript
// Pass the spanProcessor once through the service. The logger picks up the
// active OTel context automatically.
const spanProcessor = new SimpleSpanProcessor(new OTLPTraceExporter({ url: '...' }))

const eventBridge = new AmqpBridge({ config: { url: process.env.AMQP_URL } })

const myService = await myServiceV1Service.getInstance(eventBridge, {
  spanProcessor,
})
await eventBridge.start()
```

There is no `NodeSDK` wrapper needed in your PURISTA services — pass `SimpleSpanProcessor` directly to the bridge or service config. `NodeSDK` is used only in separate Temporal workers or other Node.js processes that are not PURISTA services.
