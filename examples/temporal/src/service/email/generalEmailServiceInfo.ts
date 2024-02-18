import type { ServiceInfoType } from '@purista/core'

export const generalEmailServiceInfo = {
  serviceName: 'Email',
  serviceDescription: 'the emmail domain',
} as const satisfies Omit<ServiceInfoType, 'serviceVersion'>
