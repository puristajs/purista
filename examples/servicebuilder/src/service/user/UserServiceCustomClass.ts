import { Service } from '@purista/core'

import type { UserServiceConfigType } from './UserServiceBuilder'

// A custom service class implementation
export class UserServiceCustomClass extends Service<UserServiceConfigType> {
  customClassProp = 'some'

  customFunction() {
    this.serviceLogger.debug('custom function is called')
  }
}
