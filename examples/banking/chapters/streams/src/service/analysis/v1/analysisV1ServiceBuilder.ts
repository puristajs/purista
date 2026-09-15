import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'
import { generalAnalysisServiceInfo } from '../generalAnalysisServiceInfo.js'
import type { TransactionAnalysisReader } from './TransactionAnalysisReader.js'
import { analysisServiceV1ConfigSchema } from './analysisServiceConfig.js'

export const analysisServiceInfo = {
	serviceVersion: '1',
	...generalAnalysisServiceInfo,
} as const satisfies ServiceInfoType

export const analysisV1ServiceBuilder = new ServiceBuilder(analysisServiceInfo)
	.setConfigSchema(analysisServiceV1ConfigSchema)
	.defineResource<'transactionAnalysisReader', TransactionAnalysisReader>()
