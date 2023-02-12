import { ServiceBuilder, ServiceInfoType } from '@purista/core'

import { generalEmailServiceInfo } from '../generalEmailServiceInfo'

export const emailServiceInfo: ServiceInfoType = {
  serviceVersion: '1',
  ...generalEmailServiceInfo,
}

export const EmailServiceBuilder = new ServiceBuilder(emailServiceInfo)
