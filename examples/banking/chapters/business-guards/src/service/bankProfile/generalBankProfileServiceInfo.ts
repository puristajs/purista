import type { ServiceInfoType } from '@purista/core'

export const generalBankProfileServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> =
{
	serviceName: 'BankProfile',
	serviceDescription: 'Provide the public Example Bank profile',
}