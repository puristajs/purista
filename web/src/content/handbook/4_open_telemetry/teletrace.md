---
title: Teletrace
description: Configure PURISTA with Teletrace — a lightweight open-source trace viewer.
order: 406000
---

# Teletrace

[Teletrace](https://github.com/teletrace/teletrace) is a lightweight open-source trace storage and viewer. It accepts OTLP and provides a minimal UI focused purely on trace inspection — ideal when you want something simpler than Grafana or SigNoz.

![Teletrace UI](/graphic/teletrace_screenshot.png)

## Install

```bash
npm install @opentelemetry/exporter-trace-otlp-http @opentelemetry/sdk-trace-node
```

## TypeScript setup

Teletrace accepts OTLP HTTP on port `4318`, identical to Jaeger and SigNoz.

```typescript [tracing.ts]
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'

export function getSpanProcessor() {
  return new SimpleSpanProcessor(
    new OTLPTraceExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318/v1/traces',
    })
  )
}
```

Wire it into your application:

```typescript [main.ts]
import { getSpanProcessor } from './tracing.js'
import { AmqpBridge } from '@purista/amqpbridge'

const spanProcessor = getSpanProcessor()

const eventBridge = new AmqpBridge()

const myService = await myV1Service.getInstance(eventBridge, {
  spanProcessor,
})
await eventBridge.start()
await myService.start()
```

## Run it locally

The [PURISTA repository](https://github.com/puristajs/purista) includes a ready-made example in `examples/fullexample`.

```bash
# Start Teletrace
npm run teletrace:up
```

Open the **Teletrace UI** at [http://localhost:8081](http://localhost:8081).

```bash
# Start the example application
npm run teletrace:start
```

Go to the **OpenAPI UI** at [http://localhost:8080](http://localhost:8080) to trigger commands.

```bash
# Stop and clean up
npm run teletrace:down
```

## Next steps

- [Jaeger](./jaeger.md) — more mature OTLP-native trace UI
- [SigNoz](./signoz.md) — full observability stack with metrics and logs
