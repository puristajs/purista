import type { ServiceInfoType } from '@purista/core'

export const generalUserServiceInfo = {
  serviceName: 'User',
  serviceDescription: 'manage user information',
} as const satisfies Omit<ServiceInfoType, 'serviceVersion'>
