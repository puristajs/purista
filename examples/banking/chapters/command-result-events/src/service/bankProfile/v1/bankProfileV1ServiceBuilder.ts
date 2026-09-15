import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'

import { generalBankProfileServiceInfo } from '../generalBankProfileServiceInfo.js'
import { bankProfileServiceV1ConfigSchema } from './bankProfileServiceConfig.js'

export const bankProfileServiceInfo ={
	serviceVersion: '1',
	...generalBankProfileServiceInfo
} as const satisfies ServiceInfoType

const bankProfileV1ServiceBuilderInstance = new ServiceBuilder(bankProfileServiceInfo)
bankProfileV1ServiceBuilderInstance.setConfigSchema(bankProfileServiceV1ConfigSchema)

export const bankProfileV1ServiceBuilder = bankProfileV1ServiceBuilderInstance
