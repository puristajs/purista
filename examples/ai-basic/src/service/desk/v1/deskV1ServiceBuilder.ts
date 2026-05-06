import { ServiceBuilder } from '@purista/ai'
import type { ServiceInfoType } from '@purista/core'

import { generalDeskServiceInfo } from '../generalDeskServiceInfo.js'
import { deskServiceV1ConfigSchema } from './deskServiceConfig.js'

export const deskServiceInfo = {
	serviceVersion: '1',
	...generalDeskServiceInfo,
} as const satisfies ServiceInfoType

const deskV1ServiceBuilderInstance = new ServiceBuilder(deskServiceInfo)
deskV1ServiceBuilderInstance.setConfigSchema(deskServiceV1ConfigSchema)

export const deskV1ServiceBuilder = deskV1ServiceBuilderInstance
