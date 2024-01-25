import type { ServiceInfoType } from '@purista/core'

export const generalHonoServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> = {
  serviceName: 'Hono',
  serviceDescription: 'Provides a hono based web server for purista services',
}
