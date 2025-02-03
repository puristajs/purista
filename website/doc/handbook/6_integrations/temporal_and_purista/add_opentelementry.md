---
title: OpenTelemetry
description: Learn how to user combine your PURISTA application with Temporal.
order: 601040
image: /graphic/temporal_ot_screen.png
---

# OpenTelemetry

One of the powerful features of PURISTA is the deeply integrated usage of OpenTelemetry.  
In this section, you will learn how to setup OpenTelemetry in Temporal.  

This allows tracing of whole processes - no matter where parts of the process are executed.
![Temporal + PURISTA OpenTelemetry trace](/graphic/temporal_ot_screen.png)

## Add dependencies

Temporal provides official OpenTelemetry support.  
For using OpenTelemetry in Temporal, We need to add some dependencies.

```bash
npm i -s @opentelemetry/resources \
 @opentelemetry/sdk-node \
 @opentelemetry/sdk-trace-node \
 @opentelemetry/semantic-conventions \
 @temporalio/interceptors-opentelemetry
```

## Setup tracing

In this example we use [Jaeger](https://www.jaegertracing.io/) and we use the same config as our PURISTA application stored in `src/config/jaegerExporterOptions.ts`.

Here you can see the changes, which are needed to enable OpenTelemetry.

```typescript
import { fileURLToPath } from 'node:url'

import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http' // [!code ++]
import { Resource } from '@opentelemetry/resources' // [!code ++]
import { NodeSDK } from '@opentelemetry/sdk-node' // [!code ++]
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node' // [!code ++]
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions' // [!code ++]
import { Context } from '@temporalio/activity'
import { makeWorkflowExporter, OpenTelemetryActivityInboundInterceptor } from '@temporalio/interceptors-opentelemetry' // [!code ++]
import { NativeConnection, Worker } from '@temporalio/worker'

import type { EventBridge } from '@purista/core'
import { initLogger } from '@purista/core'
import { NatsBridge } from '@purista/natsbridge'

import jaegerExporterOptions from './config/jaegerExporterOptions.js' // [!code ++]
import temporalConfig from '../config/temporalConfig.js'
import natsBridgeConfig from '../config/natsBridgeConfig.js'
import * as activities from './activities/index.js'

const getPuristaBasedActivities = (eventbridge: EventBridge) => {
  const invoke = getInvoke(eventBridge)

  return {
    sendEmailVerification: (email: string) =>
      invoke<{ userId: string }> // our helper with return type
        ('Email', '1', 'sendVerificationEmail', { email }),
  }
}

export type ActivitiesType = typeof activities & ReturnType<typeof getPuristaBasedActivities>

async function run() {
  // setup OpenTelemetry
  const resource = new Resource({ // [!code ++]
    [ATTR_SERVICE_NAME]: 'temporal-worker', // [!code ++]
  }) // [!code ++]
  const exporter = new OTLPTraceExporter(jaegerExporterOptions) // [!code ++]
  const otel = new NodeSDK({ traceExporter: exporter, resource }) // [!code ++]
  await otel.start() // [!code ++]

  const spanProcessor = new SimpleSpanProcessor(exporter) // [!code ++]

  const logger = initLogger('debug')

  // inject eventBride and logger
  const eventBridge = new NatsBridge({ ...natsBridgeConfig, logger }) // [!code --]
  const eventBridge = new NatsBridge({ 
      ...natsBridgeConfig, 
      logger,
      spanProcessor // [!code ++]
    }) // [!code ++]
  await eventBridge.start()
  
  const connection = await NativeConnection.connect(temporalConfig.connect)

  const worker = await Worker.create({
    connection,
    namespace: temporalConfig.namespace,
    taskQueue: temporalConfig.taskQueue,
    workflowsPath: fileURLToPath(new URL('./workflows', import.meta.url)),
    activities: {
      ...activities,
      ...getPuristaBasedActivities(eventBridge)
    },
    interceptors: { // [!code ++]
      // example contains both workflow and interceptors
      workflowModules: [fileURLToPath(new URL('./workflows', import.meta.url))], // [!code ++]
      activityInbound: [(ctx) => new OpenTelemetryActivityInboundInterceptor(ctx)], // [!code ++]
    }, // [!code ++]
    sinks: { // [!code ++]
      exporter: makeWorkflowExporter(exporter, resource), // [!code ++]
    }, // [!code ++]
  })

  await worker.run()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

```

__And that´s it 🎉__  
You should now receive traces all the way down.  
From the web server down to the Temoral workflow.