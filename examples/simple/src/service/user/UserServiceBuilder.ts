import { ServiceBuilder, ServiceInfoType } from '@purista/core'

export const userServiceInfo: ServiceInfoType = {
  serviceName: 'User',
  serviceVersion: '1',
  serviceDescription: 'service which handles all user related information',
}

export const UserServiceBuilder = new ServiceBuilder(userServiceInfo)
