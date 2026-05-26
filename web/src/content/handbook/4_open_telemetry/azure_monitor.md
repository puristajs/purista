---
title: Azure Monitor
description: Send PURISTA OpenTelemetry traces to Azure Monitor Application Insights.
order: 408000
---

# Azure Monitor

[Azure Monitor Application Insights](https://azure.microsoft.com/en-us/products/monitor) collects distributed traces, logs, and metrics from Node.js applications. PURISTA integrates through the Azure Monitor OpenTelemetry exporter — the official, supported path for sending traces from Node.js to Application Insights.

## Install

```bash
npm install @azure/monitor-opentelemetry-exporter @opentelemetry/sdk-trace-node
```

## TypeScript setup

Use `AzureMonitorTraceExporter` from `@azure/monitor-opentelemetry-exporter`. Provide your Application Insights connection string via an environment variable:

```typescript [tracing.ts]
import { AzureMonitorTraceExporter } from '@azure/monitor-opentelemetry-exporter'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'

export function getSpanProcessor() {
  return new SimpleSpanProcessor(
    new AzureMonitorTraceExporter({
      connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
    })
  )
}
```

Wire it into your application:

```typescript [main.ts]
import { getSpanProcessor } from './tracing.js'
import { AmqpBridge } from '@purista/amqpbridge'

const spanProcessor = getSpanProcessor()

const eventBridge = new AmqpBridge({ spanProcessor })
await eventBridge.start()

const myService = await myV1Service.getInstance(eventBridge, { spanProcessor })
await myService.start()
```

## Environment variables

| Variable | Description |
|---|---|
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | Your App Insights connection string from the Azure Portal |
| `OTEL_SERVICE_NAME` | Service name shown in Azure Monitor |

## Viewing traces

1. Open the [Azure Portal](https://portal.azure.com)
2. Navigate to your Application Insights resource
3. Go to **Transaction search** to find PURISTA traces by trace ID
4. Use **Application map** to see service-to-service dependencies

## Resources

- [Azure Monitor OpenTelemetry overview](https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-overview)
- [`@azure/monitor-opentelemetry-exporter` on npm](https://www.npmjs.com/package/@azure/monitor-opentelemetry-exporter)
- [Application Insights connection strings](https://learn.microsoft.com/en-us/azure/azure-monitor/app/connection-strings)
