import type { ServiceInfoType } from '@purista/core'

export const generalKnowledgeServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> =
{
	serviceName: 'Knowledge',
	serviceDescription: 'Ingest and retrieve reviewed knowledge',
}