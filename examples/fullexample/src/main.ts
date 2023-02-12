// import { AmqpBridge } from '@purista/amqpbridge'
import { resolve } from 'node:path'

import fastifyStatic from '@fastify/static'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { DefaultEventBridge, initLogger } from '@purista/core'
import { HttpServerService } from '@purista/httpserver'

import httpServerConfig from './config/httpServerConfig'
import { EmailService } from './service/email/v1'
import { UserService } from './service/user/v1'

export const main = async (getProcessor: () => SimpleSpanProcessor) => {
  // initialize the logging
  const baseLogger = initLogger('debug')

  baseLogger.info('application starts')

  // create and init our eventbridge
  // const eventBridge = new AmqpBridge(baseLogger)
  const eventBridge = new DefaultEventBridge(baseLogger, undefined, getProcessor())
  await eventBridge.start()

  // create and init a webserver
  const httpServerService = new HttpServerService(baseLogger, eventBridge, httpServerConfig, getProcessor())

  const defaultPublicPath = resolve(__dirname, '..', 'public')

  // static file handler
  httpServerService.server?.register(fastifyStatic, {
    root: defaultPublicPath,
    decorateReply: false,
  })

  // start the webserver
  await httpServerService.start()

  // create the user service
  const userService = UserService.getInstance(baseLogger, eventBridge, undefined, getProcessor())

  // start the user service
  await userService.start()

  // create the email service
  const emailService = EmailService.getInstance(baseLogger, eventBridge, undefined, getProcessor())

  // start the email service
  await emailService.start()

  baseLogger.info('application ready')
}
