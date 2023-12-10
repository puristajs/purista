import { resolve } from 'node:path'

import fastifyStatic from '@fastify/static'
import { DefaultStateStore, gracefulShutdown, initLogger } from '@purista/core'
import { httpServerV1Service } from '@purista/httpserver'
import { MqttBridge } from '@purista/mqttbridge'

import httpServerConfig from './config/httpServerConfig.js'
import { emailV1Service } from './service/email/v1/index.js'
import { userV1Service } from './service/user/v1/index.js'

export const main = async () => {
  // initialize the logging
  const logger = initLogger('debug')

  logger.info('application starts')

  // create and init our eventbridge
  const eventBridge = new MqttBridge({
    logger,
    host: 'localhost',
  })
  await eventBridge.start()

  // create a state store
  const stateStore = new DefaultStateStore({ logger })

  // create and init a webserver
  const httpServerService = httpServerV1Service.getInstance(eventBridge, {
    serviceConfig: httpServerConfig,
  })

  const defaultPublicPath = resolve(__dirname, '..', 'public')

  // static file handler
  httpServerService.server?.register(fastifyStatic, {
    root: defaultPublicPath,
    decorateReply: false,
  })

  // start the webserver
  await httpServerService.start()

  const userService = userV1Service.getInstance(eventBridge, { logger, stateStore })
  await userService.start()

  const emailService = emailV1Service.getInstance(eventBridge, { logger, stateStore })
  await emailService.start()

  logger.info('application ready')
  logger.info(`open in browser: http://localhost:${httpServerConfig.port}`)

  gracefulShutdown(logger, [
    // begin with the event bridge to no longer accept incoming messages
    eventBridge,
    userService,
    emailService,
    stateStore,
    httpServerService,
  ])
}
