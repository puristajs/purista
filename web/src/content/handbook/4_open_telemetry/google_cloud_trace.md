---
title: Google Cloud Trace
description: Send PURISTA OpenTelemetry traces to Google Cloud Trace.
order: 409000
---

# Google Cloud Trace

[Google Cloud Trace](https://cloud.google.com/trace) collects and analyzes latency data from distributed applications. PURISTA sends traces via the Google Cloud Trace OTLP exporter — no global SDK initialization required.

## Install

```bash
npm install @google-cloud/opentelemetry-cloud-trace-exporter @opentelemetry/sdk-trace-node
```

## TypeScript setup

The Cloud Trace exporter implements the `SpanExporter` interface, so you wrap it in a `SimpleSpanProcessor` and pass it directly to PURISTA.

```typescript [tracing.ts]
import { TraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'

export function getSpanProcessor() {
  // Uses Application Default Credentials automatically
  const exporter = new TraceExporter({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
  })

  return new SimpleSpanProcessor(exporter)
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

## Authentication

The exporter uses [Application Default Credentials](https://cloud.google.com/docs/authentication/application-default-credentials):

- **Local development:** `gcloud auth application-default login`
- **Cloud Run / GKE / Compute Engine:** the default service account is used automatically
- **CI/CD:** set `GOOGLE_APPLICATION_CREDENTIALS` to the path of a service account JSON key

## Required IAM permission

The service account needs the `cloudtrace.traces.patch` permission (included in the `Cloud Trace Agent` role).

## Environment variables

| Variable | Description |
|---|---|
| `GOOGLE_CLOUD_PROJECT` | GCP project ID |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to service account key (optional in most environments) |
| `OTEL_SERVICE_NAME` | Service name shown in Cloud Trace |

## Viewing traces

1. Open [Cloud Trace](https://console.cloud.google.com/traces) in the GCP Console
2. Select your project
3. Use the trace list or waterfall view to navigate the PURISTA message flow across services

## Resources

- [Cloud Trace documentation](https://cloud.google.com/trace/docs/setup)
- [OpenTelemetry Cloud Trace exporter](https://github.com/GoogleCloudPlatform/opentelemetry-operations-js)
