import { ServiceBuilder, type ServiceInfoType } from '@purista/core'
import type { AccountAccess } from '../../../accountAccess.js'
import type { LegacyBankClient } from '../../../legacyBank.js'
import type { TransactionRepository } from '../../../transactionRepository.js'
import { generalBankingServiceInfo } from '../generalBankingServiceInfo.js'
import { bankingServiceV1ConfigSchema } from './bankingServiceConfig.js'

export const bankingServiceInfo = {
	serviceVersion: '1',
	...generalBankingServiceInfo,
} as const satisfies ServiceInfoType

export const bankingV1ServiceBuilder = new ServiceBuilder(bankingServiceInfo)
	.setConfigSchema(bankingServiceV1ConfigSchema)
	.defineResource<'transactions', TransactionRepository>()
	.defineResource<'accountAccess', AccountAccess>()
	.defineResource<'legacyBank', LegacyBankClient>()
