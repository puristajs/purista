import { ZipkinExporter } from '@opentelemetry/exporter-zipkin'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { DefaultLogger, gracefulShutdown, LogLevelName } from '@purista/core'
import {
  DaprConfigStore,
  DaprEventBridge,
  DaprSecretStore,
  DaprStateStore,
  getDefaultClientConfig,
} from '@purista/dapr-sdk'
import { serve } from '@purista/hono-node-server'
import pino from 'pino'
import pretty from 'pino-pretty'

import { userV1Service } from '../../src/service/user/v1/userV1Service'

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
    config: {
      serve,
      clientConfig: getDefaultClientConfig(),
    },
  })

  const secretStore = new DaprSecretStore({ logger, config: { secretStoreName: 'local-secret-store' } })
  const stateStore = new DaprStateStore({ logger, config: { stateStoreName: 'local-state-store' } })
  const configStore = new DaprConfigStore({ logger, config: { configStoreName: 'local-config-store' } })

  const userService = userV1Service.getInstance(eventBridge, {
    spanProcessor,
    logger,
    secretStore,
    stateStore,
    configStore,
  })
  await userService.start()

  await eventBridge.start()

  gracefulShutdown(logger, [
    // begin with the event bridge to no longer accept incoming messages
    eventBridge,
    userService,
    {
      name: 'OTSpanProcessor',
      destroy: () => spanProcessor.shutdown(),
    },
  ])
}

main()
