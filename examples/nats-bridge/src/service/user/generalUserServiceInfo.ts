import { ServiceInfoType } from '@purista/core'

export const generalUserServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> = {
  serviceName: 'User',
  serviceDescription: 'manage user information',
}
