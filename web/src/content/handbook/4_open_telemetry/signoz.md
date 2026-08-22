---
title: SigNoz
description: Configure PURISTA with SigNoz — an open-source full-stack observability platform.
order: 404000
---

# SigNoz

[SigNoz](https://signoz.io) is an open-source observability platform that brings traces, metrics, and logs into one UI without vendor lock-in. It accepts OTLP directly, making it a natural fit for PURISTA.

![SigNoz UI showing distributed traces](/graphic/signoz_screenshot.png)

## Install

```bash
npm install @opentelemetry/exporter-trace-otlp-http @opentelemetry/sdk-trace-node \
            @opentelemetry/exporter-metrics-otlp-http @opentelemetry/sdk-metrics \
            @opentelemetry/api
```

## TypeScript setup

SigNoz accepts traces and metrics via OTLP HTTP on port `4318`.

```typescript [tracing.ts]
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { metrics } from '@opentelemetry/api'
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'

export function getSpanProcessor() {
  return new SimpleSpanProcessor(
    new OTLPTraceExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318/v1/traces',
    })
  )
}

export function setupMetrics(appName: string) {
  const meterProvider = new MeterProvider({
    readers: [
      new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT ?? 'http://localhost:4318/v1/metrics',
        }),
        exportIntervalMillis: 5000,
      }),
    ],
  })
  metrics.setGlobalMeterProvider(meterProvider)
  return meterProvider
}
```

Wire it into your application:

```typescript [main.ts]
import { getSpanProcessor, setupMetrics } from './tracing.js'
import { AmqpBridge } from '@purista/amqpbridge'

const spanProcessor = getSpanProcessor()
const meterProvider = setupMetrics('my-app')
const meter = meterProvider.getMeter('my-app')

const eventBridge = new AmqpBridge()

const myService = await myV1Service.getInstance(eventBridge, {
  spanProcessor,
  metrics: { meter },
})
await eventBridge.start()
await myService.start()
```

## Run it locally

The [PURISTA repository](https://github.com/puristajs/purista) includes a ready-made example in `examples/fullexample`.

```bash
# Start the SigNoz stack
npm run signoz:up
```

Open **SigNoz** at [http://localhost:3301](http://localhost:3301).  
Default credentials: username `admin@example.com` / password `PURISTA4love`.

```bash
# Start the example application
npm run signoz:start
```

Go to the **OpenAPI UI** at [http://localhost:8080](http://localhost:8080) to trigger commands and generate traces.

```bash
# Stop and clean up
npm run signoz:down
```

## Next steps

- [Grafana Tempo](./grafana.md) — for teams already running Grafana
- [AWS X-Ray](./aws.md) — for AWS-native deployments
