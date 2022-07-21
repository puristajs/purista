import { EventBridge, Logger, Service, ServiceInfoType } from '@purista/core'

import { userServiceCommands } from './commands'
import { userServiceSubscriptions } from './subscriptions'

export const userServiceInfo: ServiceInfoType = {
  serviceName: 'UserService',
  serviceVersion: '1',
  serviceDescription: 'service which handles all user related information',
}

export class UserService extends Service {
  constructor(baseLogger: Logger, eventBridge: EventBridge) {
    super(baseLogger, userServiceInfo, eventBridge, userServiceCommands, userServiceSubscriptions)
  }

  static async createInstance(baseLogger: Logger, eventBridge: EventBridge): Promise<UserService> {
    return new UserService(baseLogger, eventBridge)
  }
}
