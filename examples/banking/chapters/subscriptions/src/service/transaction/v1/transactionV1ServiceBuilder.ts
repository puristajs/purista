import { ServiceBuilder, type ServiceInfoType } from '@purista/core'
import { generalTransactionServiceInfo } from '../generalTransactionServiceInfo.js'
import type { TransactionRepository } from './TransactionRepository.js'
import { transactionServiceV1ConfigSchema } from './transactionServiceConfig.js'

export const transactionServiceInfo = {
	serviceVersion: '1',
	...generalTransactionServiceInfo,
} as const satisfies ServiceInfoType

export const transactionV1ServiceBuilder = new ServiceBuilder(transactionServiceInfo)
	.setConfigSchema(transactionServiceV1ConfigSchema)
	.defineResource<'transactionRepository', TransactionRepository>()
