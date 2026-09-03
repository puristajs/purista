import type { ServiceInfoType } from '@purista/core'

export const generalAnalysisServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> =
{
	serviceName: 'Analysis',
	serviceDescription: 'Read transaction projections and produce bounded summaries',
}