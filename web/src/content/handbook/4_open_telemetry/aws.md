---
title: AWS X-Ray
description: Send PURISTA OpenTelemetry traces to AWS X-Ray via OTLP.
order: 407000
---

# AWS X-Ray

[AWS X-Ray](https://aws.amazon.com/xray/) collects and visualizes distributed traces across AWS services and custom Node.js applications. PURISTA sends traces via OTLP — either directly to an ADOT Collector sidecar or to the X-Ray OTLP endpoint.

## Install

```bash
npm install @opentelemetry/exporter-trace-otlp-http @opentelemetry/sdk-trace-node
```

## TypeScript setup

### Option A — ADOT Collector sidecar (recommended for production)

Run the [AWS Distro for OpenTelemetry Collector](https://aws.amazon.com/otel/) as a sidecar. Your application sends to it via OTLP HTTP; the collector forwards to X-Ray with the correct authentication and protocol translation.

```typescript [tracing.ts]
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'

export function getSpanProcessor() {
  // ADOT Collector sidecar listens on port 4318
  return new SimpleSpanProcessor(
    new OTLPTraceExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318/v1/traces',
    })
  )
}
```

### Option B — Direct OTLP to X-Ray (preview)

AWS offers a managed OTLP endpoint in supported regions. Send traces directly without a sidecar:

```typescript [tracing.ts]
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'

export function getSpanProcessor() {
  return new SimpleSpanProcessor(
    new OTLPTraceExporter({
      // Replace <region> with your AWS region, e.g. us-east-1
      url: `https://xray.${process.env.AWS_REGION}.amazonaws.com/v1/traces`,
      headers: {
        // SigV4 signing is handled by the ADOT SDK or a custom interceptor
      },
    })
  )
}
```

Wire it into your application:

```typescript [main.ts]
import { getSpanProcessor } from './tracing.js'
import { AmqpBridge } from '@purista/amqpbridge'

const spanProcessor = getSpanProcessor()

const runtimeObservability = { spanProcessor }
const eventBridge = new AmqpBridge(runtimeObservability)

const myService = await myV1Service.getInstance(eventBridge, {
  ...runtimeObservability,
})
await eventBridge.start()
await myService.start()
```

## IAM permissions

The IAM role running your application (or the ADOT Collector) needs:

```json
{
  "Effect": "Allow",
  "Action": [
    "xray:PutTraceSegments",
    "xray:PutTelemetryRecords"
  ],
  "Resource": "*"
}
```

## Environment variables

| Variable | Description | Example |
|---|---|---|
| `AWS_REGION` | AWS region for X-Ray | `us-east-1` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP endpoint (ADOT Collector) | `http://localhost:4318` |
| `OTEL_SERVICE_NAME` | Service name shown in X-Ray | `user-service` |

## Viewing traces

Open the [X-Ray console](https://console.aws.amazon.com/xray), select **Traces**, and use the service map to navigate the distributed call graph. Each PURISTA command and subscription appears as a named segment.

## Resources

- [AWS Distro for OpenTelemetry](https://aws.amazon.com/otel/)
- [X-Ray documentation](https://docs.aws.amazon.com/xray/)
- [ADOT Collector configuration guide](https://aws-otel.github.io/docs/getting-started/collector)
