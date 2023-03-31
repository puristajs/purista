import { ZipkinExporter } from '@opentelemetry/exporter-zipkin'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { gracefulShutdown, initLogger } from '@purista/core'
import { DaprEventBridge } from '@purista/dapr-sdk'

import { userV1Service } from '../../src/service/user/v1/userV1Service'

const main = async () => {
  // initialize the logging
  const logger = initLogger()

  logger.info('application starts')

  const spanProcessor = new SimpleSpanProcessor(
    new ZipkinExporter({
      url: 'http://localhost:9411/api/v2/spans',
    }),
  )

  const eventBridge = new DaprEventBridge({ config: {}, spanProcessor })
  await eventBridge.start()

  const userService = userV1Service.getInstance(eventBridge, { spanProcessor })
  await userService.start()

  gracefulShutdown(logger, [
    // start with the event bridge to no longer accept incoming messages
    eventBridge,
    userService,
    {
      name: 'OTSpanProcessor',
      destroy: () => spanProcessor.shutdown(),
    },
  ])
}

main()
