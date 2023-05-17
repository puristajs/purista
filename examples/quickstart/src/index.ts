import { DefaultEventBridge } from '@purista/core'
import { httpServerV1Service } from '@purista/httpserver'

import { pingV1Service } from './service/ping/v1'

export const main = async () => {
  // initiate the event bridge as first step
  const eventBridge = new DefaultEventBridge()
  await eventBridge.start()
  // initiate the webserver service as second step
  const httpServerService = httpServerV1Service.getInstance(eventBridge)

  // start the webserver
  await httpServerService.start()

  // add your service
  const pingService = pingV1Service.getInstance(eventBridge)
  await pingService.start()
}

main()
