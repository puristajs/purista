import type { ServiceInfoType } from '@purista/core'

export const generalDeskServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> = {
	serviceName: 'desk',
	serviceDescription: 'Developer Desk showcase service used by ai-basic to demonstrate PURISTA AI capabilities',
}
