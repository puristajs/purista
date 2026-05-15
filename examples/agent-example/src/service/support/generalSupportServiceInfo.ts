import type { ServiceInfoType } from '@purista/core'

export const generalSupportServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> = {
	serviceName: 'Support',
	serviceDescription: 'Support ticket triage with a core PURISTA agent',
}
