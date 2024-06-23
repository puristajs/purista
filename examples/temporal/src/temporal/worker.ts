import { fileURLToPath } from 'node:url'

import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { Resource } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import type { EventBridge } from '@purista/core'
import { initLogger } from '@purista/core'
import { NatsBridge } from '@purista/natsbridge'
import { makeWorkflowExporter, OpenTelemetryActivityInboundInterceptor } from '@temporalio/interceptors-opentelemetry'
import { NativeConnection, Worker } from '@temporalio/worker'

import jaegerExporterOptions from '../config/jaegerExporterOptions.js' // [!code ++]
import natsBridgeConfig from '../config/natsBridgeConfig.js'
import temporalConfig from '../config/temporalConfig.js'
import * as activities from './activities/index.js'
import { getInvoke } from './getInvoke.js'

const getPuristaBasedActivities = (eventBridge: EventBridge) => {
  const invoke = getInvoke(eventBridge)

  return {
    createAccount: (input: unknown) => invoke<{ accountId: string }>('Account', '1', 'createAccount', input),
    createUser: (input: unknown) => invoke<{ userId: string }>('User', '1', 'createUser', input),
    sendEmailVerification: (email: string) =>
      invoke<{ userId: string }>('Email', '1', 'sendVerificationEmail', { email }),
  }
}

export type ActivitiesType = typeof activities & ReturnType<typeof getPuristaBasedActivities>

async function run() {
  // setup OpenTelemetry
  const resource = new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'temporal-worker',
  })
  const exporter = new OTLPTraceExporter(jaegerExporterOptions)
  const otel = new NodeSDK({ traceExporter: exporter, resource })
  otel.start()

  const spanProcessor = new SimpleSpanProcessor(exporter)
  const logger = initLogger('debug')

  // inject eventBride and logger
  const eventBridge = new NatsBridge({ ...natsBridgeConfig, logger, spanProcessor })
  await eventBridge.start()

  // Step 1: Establish a connection with Temporal server.
  //
  // Worker code uses `@temporalio/worker.NativeConnection`.
  // (But in your application code it's `@temporalio/client.Connection`.)
  const connection = await NativeConnection.connect(temporalConfig.connect)
  // Step 2: Register Workflows and Activities with the Worker.
  const worker = await Worker.create({
    connection,
    namespace: temporalConfig.namespace,
    taskQueue: temporalConfig.taskQueue,
    // Workflows are registered using a path as they run in a separate JS context.
    workflowsPath: fileURLToPath(new URL('./workflows', import.meta.url)),
    activities: {
      ...activities,
      ...getPuristaBasedActivities(eventBridge),
    },
    interceptors: {
      // example contains both workflow and interceptors
      workflowModules: [fileURLToPath(new URL('./workflows', import.meta.url))],
      activityInbound: [(ctx) => new OpenTelemetryActivityInboundInterceptor(ctx)],
    },
    sinks: {
      exporter: makeWorkflowExporter(exporter, resource),
    },
  })

  // Step 3: Start accepting tasks on the `default-task-queue` queue
  //
  // The worker runs until it encounters an unexpected error or the process receives a shutdown signal registered on
  // the SDK Runtime object.
  //
  // By default, worker logs are written via the Runtime logger to STDERR at INFO level.
  //
  // See https://typescript.temporal.io/api/classes/worker.Runtime#install to customize these defaults.
  await worker.run()
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
