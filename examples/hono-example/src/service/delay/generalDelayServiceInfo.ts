import type { ServiceInfoType } from '@purista/core'

export const generalDelayServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> = {
  serviceName: 'Delay',
  serviceDescription: 'Example to show a service which starts after webserver and registers commands',
}
