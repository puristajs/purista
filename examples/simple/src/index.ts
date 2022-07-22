import { DefaultEventBridge, initLogger } from '@purista/core'
import { HttpServerService } from '@purista/httpserver'

import config from './config'
import { UserService } from './service/user'

const main = async () => {
  // initialize the logging
  const baseLogger = initLogger('debug')

  // create and init our eventbridge
  const eventBridge = new DefaultEventBridge(baseLogger)

  // create and init a webserver
  const httpServerService = new HttpServerService(baseLogger, eventBridge, config)

  // start the webserver
  await httpServerService.start()

  // create the user service
  const userService = await UserService.createInstance(baseLogger, eventBridge)

  // start the user service
  await userService.start()
}

main()
