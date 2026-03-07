import type { ServiceInfoType } from '@purista/core'

export const generalSupportServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> = {
	serviceName: 'support',
	serviceDescription: 'Support service used by ai-basic to demonstrate tool calls and agent invocation',
}
