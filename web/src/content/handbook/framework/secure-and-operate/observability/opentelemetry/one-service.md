---
title: Configure OpenTelemetry for one service
description: Create one exporter-backed span processor and Meter, pass them to one event bridge and service instance, then prove a trace and metric from a controlled command.
order: 10211
---

Use this shape when one process owns one EventBridge and one business service.
It gives the bridge and service their own PURISTA tracer providers while sending
completed spans through the processor you supply.

## Install and compose the telemetry dependencies

```bash title="Install OpenTelemetry export dependencies"
npm install @opentelemetry/api @opentelemetry/exporter-metrics-otlp-http @opentelemetry/exporter-trace-otlp-http @opentelemetry/sdk-metrics @opentelemetry/sdk-trace-node
```

The exporter endpoint, credentials, TLS, and collector must already be
provisioned by the application platform. Installing these packages does not
enable telemetry until the processor and Meter are passed to PURISTA.

```ts title="src/telemetry.ts"
import { metrics } from '@opentelemetry/api'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
})

export const spanProcessor = new BatchSpanProcessor(traceExporter)
export const meterProvider = new MeterProvider({
  readers: [
    new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT,
      }),
    }),
  ],
})
metrics.setGlobalMeterProvider(meterProvider)
export const meter = meterProvider.getMeter('support-service')
```

For local verification, replace `OTLPMetricExporter` with
`ConsoleMetricExporter` from `@opentelemetry/sdk-metrics`. Do not deploy that
replacement: an OTLP endpoint, credentials, TLS policy, and collector/exporter
health are application-owned production requirements.

## Pass both telemetry surfaces at construction

```ts title="src/main.ts"
const eventBridge = new DefaultEventBridge({ logger, spanProcessor, metrics: { meter } })
await eventBridge.start()

const service = await supportV1Service.getInstance(eventBridge, {
  logger,
  spanProcessor,
  metrics: {
    meter,
    defaultAttributes: { deployment: 'production' },
  },
})
await service.start()
```

`spanProcessor` configures tracing; Framework metrics are enabled by default.
`metrics: { meter }` selects the Meter that creates this component's
instruments. Pass both to both components—supplying a Meter to the service does
not instrument the EventBridge, and supplying a span processor does not create
metric instruments.

## Verify the result

1. Invoke one controlled command with non-sensitive fixture data.
2. Confirm a bridge/service trace reaches the collector and has the expected
   service/component resource identity.
3. Confirm one Framework metric appears with only low-cardinality attributes.
4. Stop the process through the normal shutdown path and flush the processor
   and Meter provider without retrying business work when the collector is down.

Next: [configure structured logging](/handbook/framework/secure-and-operate/observability/logging/) or [configure a monolith](/handbook/framework/secure-and-operate/observability/opentelemetry/monolith/).
