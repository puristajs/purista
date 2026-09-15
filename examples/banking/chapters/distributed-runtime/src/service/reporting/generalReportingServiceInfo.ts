import type { ServiceInfoType } from '@purista/core'

export const generalReportingServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> =
{
	serviceName: 'Reporting',
	serviceDescription: 'Create operational transaction snapshots',
}