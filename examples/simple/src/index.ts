import { DefaultEventBridge, initLogger } from '@purista/core'
import { HttpServerService } from '@purista/httpserver'

import config from './config'
import { UserService } from './service/user'

const main = async () => {
  // initialize the logging
  const baseLogger = initLogger('debug')

  baseLogger.info('application starts')

  // create and init our eventbridge
  const eventBridge = new DefaultEventBridge(baseLogger)
  await eventBridge.start()

  // create and init a webserver
  const httpServerService = new HttpServerService(baseLogger, eventBridge, config)

  // start the webserver
  await httpServerService.start()

  // create the user service
  const userService = UserService.getInstance(baseLogger, eventBridge)

  // start the user service
  await userService.start()

  baseLogger.info('application ready')
}

main()
