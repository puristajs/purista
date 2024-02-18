import type { ServiceInfoType } from '@purista/core'

export const generalUserServiceInfo = {
  serviceName: 'User',
  serviceDescription: 'the user domain service',
} as const satisfies Omit<ServiceInfoType, 'serviceVersion'>
