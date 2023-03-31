import { ZipkinExporter } from '@opentelemetry/exporter-zipkin'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { gracefulShutdown, initLogger } from '@purista/core'
import { DaprEventBridge } from '@purista/dapr-sdk'

import { emailV1Service } from '../../src/service/email/v1/emailV1Service'

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

  const emailService = emailV1Service.getInstance(eventBridge, { spanProcessor })
  await emailService.start()

  gracefulShutdown(logger, [
    // start with the event bridge to no longer accept incoming messages
    eventBridge,
    emailService,
    {
      name: 'OTSpanProcessor',
      destroy: () => spanProcessor.shutdown(),
    },
  ])
}

main()
