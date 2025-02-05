import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'

import { generalCardServiceInfo } from '../generalCardServiceInfo.js'
import { cardServiceV1ConfigSchema } from './cardServiceConfig.js'

export const cardServiceInfo = {
	serviceVersion: '1',
	...generalCardServiceInfo,
} as const satisfies ServiceInfoType

// create a service builder instance and assign service config schema and default config.

export const cardV1ServiceBuilder = new ServiceBuilder(cardServiceInfo).setConfigSchema(cardServiceV1ConfigSchema)
