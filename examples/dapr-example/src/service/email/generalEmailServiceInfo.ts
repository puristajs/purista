import type { ServiceInfoType } from '@purista/core'

export const generalEmailServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> = {
  serviceName: 'Email',
  serviceDescription: 'sends emails to customers',
}
