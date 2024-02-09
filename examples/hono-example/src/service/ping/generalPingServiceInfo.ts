import type { ServiceInfoType } from '@purista/core'

export const generalPingServiceInfo = {
  serviceName: 'Ping',
  serviceDescription: 'Example ping service',
} as const satisfies Omit<ServiceInfoType, 'serviceVersion'>
