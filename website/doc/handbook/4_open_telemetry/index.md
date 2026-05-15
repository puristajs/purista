---
title: OpenTelemetry
description: Tracing and metrics with OpenTelemetry in PURISTA TypeScript backend applications and how to use them.
order: 400000
---

# OpenTelemetry

PURISTA records traces and metrics through [OpenTelemetry](https://opentelemetry.io/) APIs.
The framework stays provider-neutral: your application owns the OpenTelemetry SDK, readers, exporters, collector endpoints, and backend-specific configuration.

This lets one application send PURISTA framework telemetry, custom application metrics, and AI harness telemetry to the same OpenTelemetry provider without coupling `@purista/core` to a vendor or exporter.

## Tracing

Tracing follows message flow through commands, subscriptions, streams, queues, bridges, resources, and HTTP surfaces.
Existing tracing setup still uses `spanProcessor`; metrics are configured separately through `metrics`.

```typescript
const service = await userV1Service.getInstance(eventBridge, {
	spanProcessor,
	metrics: { meter: meterProvider.getMeter('purista.app') },
})
```

## Metrics

PURISTA framework metrics are emitted through the OpenTelemetry Metrics API.
If your application configures a global OTel `MeterProvider`, PURISTA and `@purista/harness` can use the same provider.
You can also pass an explicit metrics runtime option when constructing services or bridges.

PURISTA does not start a collector, exporter, Prometheus endpoint, or `/metrics` route automatically.

### Minimal local setup

Use a console reader for local development or tests that should run without external telemetry infrastructure.

```typescript
import { metrics } from '@opentelemetry/api'
import { ConsoleMetricExporter, MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'

export const meterProvider = new MeterProvider({
	readers: [
		new PeriodicExportingMetricReader({
			exporter: new ConsoleMetricExporter(),
			exportIntervalMillis: 1000,
		}),
	],
})

metrics.setGlobalMeterProvider(meterProvider)
```

Pass the provider into PURISTA runtime options when you do not want to rely on the global provider:

```typescript
const service = await orderV1Service.getInstance(eventBridge, {
	metrics: { meter: meterProvider.getMeter('purista.app') },
})
```

### OTLP setup

OTLP exporters are application dependencies. Configure them beside your tracing setup and keep endpoint selection in application configuration.

```typescript
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'

const metricReader = new PeriodicExportingMetricReader({
	exporter: new OTLPMetricExporter({
		url: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT,
	}),
})
```

### Prometheus

Prometheus support should be configured outside PURISTA core.
Use either an OpenTelemetry Collector that exports Prometheus metrics or an application-owned OTel Prometheus exporter.
Do not add `prom-client` to PURISTA services and do not expose request headers, request bodies, raw URLs, prompts, completions, tokens, user IDs, tenant IDs, or other high-cardinality data as metric attributes.

### Custom service metrics

Declare custom metrics on `ServiceBuilder`.
Custom metric names must start with `app.` and use low-cardinality attributes.

```typescript
import { ServiceBuilder, type ServiceInfoType } from '@purista/core'
import { z } from 'zod'

const checkoutServiceInfo = {
	serviceName: 'Checkout',
	serviceVersion: '1',
	serviceDescription: 'Checkout workflow',
} as const satisfies ServiceInfoType

const checkoutMetricAttributes = z.object({
	channel: z.enum(['web', 'api']),
})

export const checkoutV1ServiceBuilder = new ServiceBuilder(checkoutServiceInfo)
	.defineMetric('app.checkout.started', {
		kind: 'counter',
		unit: '{checkout}',
		description: 'Started checkout flows',
		attributes: checkoutMetricAttributes,
	})
	.defineMetric('app.checkout.duration', {
		kind: 'histogram',
		unit: 'ms',
		description: 'Checkout command duration',
		attributes: checkoutMetricAttributes,
	})
```

Handlers receive typed metric handles through `context.metrics`.
Counters and up-down counters use `add`; histograms use `record`.

```typescript
setCommandFunction(async context => {
	const started = Date.now()

	context.metrics['app.checkout.started'].add(1, { channel: 'web' })

	try {
		return await runCheckout()
	} finally {
		context.metrics['app.checkout.duration'].record(Date.now() - started, { channel: 'web' })
	}
})
```

The handler context does not expose a raw metric recorder.
Unknown metric names, wrong metric methods, and wrong attributes are type errors when the service builder types are preserved.

### Agent custom metrics

Service-level custom metrics are visible to commands, subscriptions, streams, queue workers, and attached agents.
Agent-local metrics are declared on `AgentQueueBuilder` and are only visible inside that agent handler.

```typescript
const triageAgent = supportServiceBuilder
	.getAgentQueueBuilder('triageTicket', 'Classifies support tickets')
	.defineMetric('app.agent.escalations', {
		kind: 'counter',
		unit: '{escalation}',
		description: 'Tickets escalated by the triage agent',
		attributes: z.object({ priority: z.enum(['normal', 'high']) }),
	})
	.setRunFunction(async context => {
		context.metrics['app.agent.escalations'].add(1, { priority: 'high' })
		return await triageTicket(context)
	})
```

### AI harness alignment

PURISTA records service and agent wrapper metrics, such as agent run count, duration, and active runs.
`@purista/harness` owns GenAI semantic-convention metrics, model metrics, token metrics, and tool metrics.
Do not duplicate token or model-call metrics in PURISTA handlers.

When you pass `ai.telemetry` to a service, PURISTA forwards those options to the harness runtime:

```typescript
const service = await supportService.getInstance(eventBridge, {
	metrics: { meter: meterProvider.getMeter('purista.app') },
	ai: {
		telemetry: { captureContent: false },
		models,
	},
})
```

Keep these setup points separate:

- tracing: `spanProcessor`
- PURISTA metrics: `metrics`
- harness telemetry: `ai.telemetry`

### Migration from tracing-only applications

Existing tracing-only applications can keep their `spanProcessor` setup unchanged.
Add an application-owned OTel metrics SDK setup, pass the metrics runtime option to services and bridges that should emit metrics, then add custom `app.*` metric declarations where business metrics are needed.
