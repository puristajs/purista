import { resolve } from 'node:path'

import fastifyStatic from '@fastify/static'
import { SpanProcessor } from '@opentelemetry/sdk-trace-base'
import { AmqpBridge } from '@purista/amqpbridge'
import { DefaultConfigStore, DefaultSecretStore, gracefulShutdown, initLogger } from '@purista/core'
import { httpServerV1Service } from '@purista/httpserver'
import { RedisStateStore } from '@purista/redis-state-store'

import httpServerConfig from './config/httpServerConfig'
import { emailV1Service } from './service/email/v1'
import { userV1Service } from './service/user/v1'

export const main = async (getProcessor: () => SpanProcessor) => {
  // initialize the logging
  const logger = initLogger()

  logger.info('application starts')

  const spanProcessor = getProcessor()

  // create and init our eventbridge
  const eventBridge = new AmqpBridge({
    spanProcessor,
  })
  await eventBridge.start()

  // create and init a webserver
  const httpServerService = httpServerV1Service.getInstance(eventBridge, {
    serviceConfig: httpServerConfig,
    spanProcessor,
  })

  const defaultPublicPath = resolve(__dirname, '..', 'public')

  // static file handler
  httpServerService.server?.register(fastifyStatic, {
    root: defaultPublicPath,
    decorateReply: false,
  })

  // start the webserver
  await httpServerService.start()

  // create a state store
  const stateStore = new RedisStateStore({ config: { url: 'redis://localhost:6379' } })
  // create config store
  const configStore = new DefaultConfigStore({
    config: {
      emailProviderUrl: 'https://example.com',
    },
  })
  // create secret store
  const secretStore = new DefaultSecretStore({
    config: {
      emailProviderAuthToken: 'some-secret-token',
    },
  })

  const userService = userV1Service.getInstance(eventBridge, { spanProcessor, stateStore, configStore, secretStore })
  await userService.start()

  const emailService = emailV1Service.getInstance(eventBridge, { spanProcessor, stateStore, configStore, secretStore })
  await emailService.start()

  logger.info('application ready')
  logger.info(`open in browser: http://localhost:${httpServerConfig.port}`)

  gracefulShutdown(logger, [
    // begin with the event bridge to no longer accept incoming messages
    eventBridge,
    userService,
    emailService,
    httpServerService,
    secretStore,
    stateStore,
    configStore,
    {
      name: 'OTSpanProcessor',
      destroy: () => spanProcessor.shutdown(),
    },
  ])
}
