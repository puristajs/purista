import type { ServiceInfoType } from '@purista/core'

export const generalTransactionServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> =
{
	serviceName: 'Transaction',
	serviceDescription: 'Record and retrieve synthetic transactions',
}