import { AmqpBridge } from '@purista/amqpbridge'
import { initLogger } from '@purista/core'
import { HttpServerService } from '@purista/httpserver'

import config from './config'
import { UserService } from './service/user'

const main = async () => {
  // initialize the logging
  const baseLogger = initLogger('debug')

  baseLogger.info('application starts')

  // create and init our eventbridge
  const eventBridge = new AmqpBridge(baseLogger)
  await eventBridge.start()

  // create and init a webserver
  const httpServerService = new HttpServerService(baseLogger, eventBridge, config)
  httpServerService.server?.addHook('preHandler', async (req) => {
    // set the principalId which will be used within messages
    req.principalId = 'Bob Dylan'
  })

  // start the webserver
  await httpServerService.start()

  // create the user service
  const userService = UserService.getInstance(baseLogger, eventBridge)

  // start the user service
  await userService.start()

  baseLogger.info('application ready')
}

main()
