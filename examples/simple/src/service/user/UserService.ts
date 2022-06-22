import { EventBridge, Logger, Service, ServiceInfoType } from '@purista/core'

import { userServiceCommands } from './commands'

export const userServiceInfo: ServiceInfoType = {
  serviceName: 'User',
  serviceVersion: '1.0.0',
  serviceDescription: 'service which handles all user related information',
}

export class UserService extends Service {
  constructor(baseLogger: Logger, eventBridge: EventBridge) {
    super(baseLogger, userServiceInfo, eventBridge, userServiceCommands, [])
  }

  static async createInstance(baseLogger: Logger, eventBridge: EventBridge): Promise<UserService> {
    const instance = new UserService(baseLogger, eventBridge)
    return instance
  }
}
