import type { ServiceInfoType } from '@purista/core'

export const generalTheServiceServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> = {
  serviceName: 'TheService',
  serviceDescription: 'a example service',
}
