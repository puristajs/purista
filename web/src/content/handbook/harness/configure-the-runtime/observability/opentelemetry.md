---
title: Export OpenTelemetry traces and metrics
description: Start an application-owned OpenTelemetry SDK, configure safe Harness telemetry, propagate trace context, and flush on shutdown.
order: 294
---

The Harness already instruments its execution. To receive that data, start an
OpenTelemetry SDK with trace and metric exporters before creating a session.
This guide uses OTLP/HTTP because it keeps the application independent of the
backend behind the collector.

## 1. Install the optional OpenTelemetry runtime

```sh title="install-opentelemetry.sh"
npm install @opentelemetry/sdk-node \
  @opentelemetry/resources \
  @opentelemetry/semantic-conventions \
  @opentelemetry/exporter-trace-otlp-http \
  @opentelemetry/exporter-metrics-otlp-http \
  @opentelemetry/sdk-metrics
```

These packages are not installed by `@purista/harness`. Without an initialized
SDK, the Harness still runs and its OpenTelemetry API calls are effectively
no-ops; no traces or metrics reach a backend.

## 2. Start the SDK

```ts title="src/observability/startOpenTelemetry.ts"
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

export function startOpenTelemetry(): NodeSDK {
	const baseUrl = process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318'
	const sdk = new NodeSDK({
		resource: resourceFromAttributes({
			[ATTR_SERVICE_NAME]: 'support-agent',
		}),
		traceExporter: new OTLPTraceExporter({
			url: `${baseUrl.replace(/\/$/, '')}/v1/traces`,
		}),
		metricReaders: [
			new PeriodicExportingMetricReader({
				exporter: new OTLPMetricExporter({
					url: `${baseUrl.replace(/\/$/, '')}/v1/metrics`,
				}),
				exportIntervalMillis: 10_000,
			}),
		],
	})

	sdk.start()
	return sdk
}
```

Use a different `service.name` for independently deployed processes. A single
logical name makes one process searchable while trace IDs connect calls across
services. Configure collector authentication through deployment secrets and
the standard OpenTelemetry environment variables; do not put headers in source
control.

## 3. Configure the Harness capture boundary

```ts title="src/createSupportHarness.ts"
import { defineHarness, JsonLogger } from '@purista/harness'

export const supportHarness = defineHarness({ name: 'support-agent' })
	.logger(new JsonLogger({ level: 'info' }))
	.telemetry({
		flavor: 'dual',
		contentCaptureMode: 'NO_CONTENT',
	})
	// Register models, agents, tools, and workflows here.
	.build()
```

| API or option | Values | Guidance |
| --- | --- | --- |
| [`defineHarness(...)`](/handbook/api/functions/_purista_harness.defineHarness/) | Optional diagnostic name | Creates the application composition root. Use a stable name; it is not a tenant or authorization boundary. |
| [`.logger(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#logger) | Any Harness `Logger` | Use `JsonLogger` for correlated JSON or supply a compatible application logger. |
| [`.telemetry(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#telemetry) | `TelemetryOptions` | Selects Harness emission format and content capture. It does not start an SDK or exporter. |
| `flavor` | `dual`, `gen_ai_only`, `openinference_only` | `dual` emits compatible GenAI and OpenInference attributes. Choose one convention only when the backend requires it. |
| `contentCaptureMode` | `NO_CONTENT`, `SPAN_ONLY`, `EVENT_ONLY`, `SPAN_AND_EVENT` | Start with `NO_CONTENT`. Other values permit supported content capture locations and require a reviewed privacy, retention, and access policy. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | No arguments | Creates the configured runtime after all adapters are registered. |

The current core never records prompts, model output, tool input/results,
files, expected output, or context content in any mode. Memory capture follows
its bounded facade policy when a content mode is enabled. `NO_CONTENT` remains
the safest portable default because provider and future integration behavior
can differ.

## 4. Record application metrics

Harness metrics describe framework operations. Add application metrics only at
business boundaries that the Harness cannot infer.

```ts title="src/workflows/handleTicket.ts"
handler: async ctx => {
	ctx.metrics.counter('support.tickets.started', 1, {
		workflow: 'handle_ticket',
	})

	return ctx.metrics.duration('support.ticket.duration', { workflow: 'handle_ticket' }, () =>
		ctx.agents.answer_ticket(ctx.input),
	)
}
```

| Helper | Use it for |
| --- | --- |
| `ctx.metrics.counter(name, value?, attrs?)` | Counts such as accepted tickets or fallback selections. The default increment is `1`. |
| `ctx.metrics.histogram(name, value, attrs?)` | Distributions such as batch size or externally measured duration. |
| `ctx.metrics.duration(name, attrs, fn)` | Executes an async operation and records elapsed **seconds**, including failed calls. |

Use an application prefix such as `support.`. Do not create application
instruments under `harness.*` or `gen_ai.*`. Attribute values must have bounded
cardinality: use a workflow name or outcome, not a ticket, user, session, or
run ID.

## 5. Continue an incoming distributed trace

Pass W3C `traceparent` and optional `tracestate` from the authenticated
transport boundary into the invocation options:

```ts title="src/http/handleSupportRequest.ts"
const result = await session.workflows.handle_ticket.run(input, {
	traceparent: request.headers.get('traceparent') ?? undefined,
	tracestate: request.headers.get('tracestate') ?? undefined,
})
```

[`InvokeOptions.traceparent`](/handbook/api/interfaces/_purista_harness.InvokeOptions/#traceparent)
becomes the parent of the Harness run. Provider adapters receive current trace
context from the Harness. A custom remote adapter can use
`context.telemetry.currentTraceparent()` after inheriting the Harness context
through `configureHarnessContext(context)`.

Accept trace context only through the transport component that owns request
validation. Do not copy arbitrary trace headers into model prompts or durable
business data.

## 6. Shut down in the correct order

```ts title="src/main.ts"
const telemetry = startOpenTelemetry()
const harness = createSupportHarness()

try {
	await runServer(harness)
} finally {
	await harness.shutdown()
	await telemetry.shutdown()
}
```

Stop accepting work first, wait for active Harness work to finish, shut down
the Harness, and then shut down the OpenTelemetry SDK. Reversing the last two
steps can lose final spans and metric batches.

## 7. Verify one request end to end

For one known request, confirm:

- a root Harness run span and child agent/model/tool spans share one trace;
- the application log contains the same `trace_id` and a `span_id`;
- `support.tickets.started` and `support.ticket.duration` appear;
- prompt and answer text are absent with `NO_CONTENT`;
- an intentional failure sets an error status without exposing payloads;
- process shutdown delivers the final trace and metric batch.

The maintained
[`observability-quickstart`](https://github.com/puristajs/ai-harness/tree/main/examples/observability-quickstart)
uses in-memory exporters in its automated test, so these guarantees are checked
without a collector. Its runnable entry point uses the OTLP exporters shown
above.

## Useful built-in signals

| Signal | What it helps answer |
| --- | --- |
| `harness.workflow.run`, `invoke_agent <name>`, `execute_tool <name>` spans | Where time and failures occur in one request. |
| `gen_ai.client.token.usage` | How provider-reported token usage changes. |
| `gen_ai.client.operation.duration` | Model-operation latency in seconds. |
| `harness.session.run` | Overall session run health. |
| `harness.permission.denials` | Whether permission configuration is blocking actions. |

Signal availability follows the operations executed and the data reported by
the provider. A missing token metric may mean the provider did not return usage,
not that the run was unobserved.
