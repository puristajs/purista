---
title: Export OpenTelemetry traces and metrics
description: Start the application-owned OpenTelemetry SDK before creating the Harness and keep capture content-free by default.
order: 294
---

Install the OpenTelemetry SDK and exporters separately. Start them before
`definition.getInstance(...)`, and flush them after the Harness closes.

```sh title="Opentelemetry example 1"
npm install @opentelemetry/sdk-node @opentelemetry/exporter-trace-otlp-http @opentelemetry/exporter-metrics-otlp-http
```
```ts title="Opentelemetry example 3"
import { defineHarness, JsonLogger } from '@purista/harness'
const definition = defineHarness({ name: 'support-agent' }).addAgent(answer)
const harness = await definition.getInstance({
  logger: new JsonLogger({ level: 'info' }),
  telemetry: { flavor: 'dual', contentCaptureMode: 'NO_CONTENT' },
  models,
})
```
Harness instrumentation emits through the OpenTelemetry API; it does not start
a collector or exporter. `NO_CONTENT` avoids prompts, completions, tool values,
files, credentials, and tenant data in telemetry. Verify one request, shutdown
flush, cancellation, and exporter failure behavior in deployment.
