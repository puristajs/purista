import { serve } from '@hono/node-server'
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'
import type { LogLevelName } from '@purista/core'
import { DefaultLogger, gracefulShutdown } from '@purista/core'
import { DaprConfigStore, DaprEventBridge, DaprSecretStore, DaprStateStore } from '@purista/dapr-sdk'
import pino from 'pino'
import pretty from 'pino-pretty'

import { emailV1Service } from '../../src/service/email/v1/emailV1Service.js'

const main = async () => {
  // initialize the logging
  const logLevel: LogLevelName = 'debug'
  const stream = pretty({
    colorize: false,
  })
  const logger = new DefaultLogger(pino({ level: logLevel }, stream))

  logger.info('application starts')

  const spanProcessor = new SimpleSpanProcessor(
    new ZipkinExporter({
      url: 'http://localhost:9411/api/v2/spans',
    }),
  )

  const eventBridge = new DaprEventBridge({
    spanProcessor,
    logger,
    serve,
  })

  const secretStore = new DaprSecretStore({ logger, secretStoreName: 'local-secret-store' })
  const stateStore = new DaprStateStore({ logger, stateStoreName: 'local-state-store' })
  const configStore = new DaprConfigStore({
    logger,
    configStoreName: 'local-config-store',
    enableSet: true,
  })

  const emailService = await emailV1Service.getInstance(eventBridge, {
    spanProcessor,
    logger,
    secretStore,
    stateStore,
    configStore,
  })
  await emailService.start()

  await eventBridge.start()

  gracefulShutdown(logger, [
    // begin with the event bridge to no longer accept incoming messages
    eventBridge,
    emailService,
    {
      name: 'OTSpanProcessor',
      destroy: () => spanProcessor.shutdown(),
    },
  ])
}

main()
