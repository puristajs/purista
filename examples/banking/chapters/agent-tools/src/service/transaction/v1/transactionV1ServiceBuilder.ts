import { ServiceBuilder } from '@purista/core'
import type { AccountReadPolicy, TransactionSummaryReader } from './TransactionResources.js'

export const transactionV1ServiceBuilder = new ServiceBuilder({
	serviceName: 'Transaction',
	serviceVersion: '1',
	serviceDescription: 'Owns transaction records and transaction business rules',
})
	.defineResource<'transactionSummaryReader', TransactionSummaryReader>()
	.defineResource<'accountReadPolicy', AccountReadPolicy>()
