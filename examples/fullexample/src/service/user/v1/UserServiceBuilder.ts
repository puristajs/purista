import { ServiceBuilder, ServiceInfoType } from '@purista/core'

import { generalUserServiceInfo } from '../generalUserServiceInfo'

export const userServiceInfo: ServiceInfoType = {
  serviceVersion: '1',
  ...generalUserServiceInfo,
}

export const UserServiceBuilder = new ServiceBuilder(userServiceInfo)
