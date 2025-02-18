import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'

import { generalPingPongServiceInfo } from '../generalPingPongServiceInfo.js'
import { pingPongServiceV1ConfigSchema } from './pingPongServiceConfig.js'

export const pingPongServiceInfo = {
	serviceVersion: '1',
	...generalPingPongServiceInfo,
} as const satisfies ServiceInfoType

export const pingPongV1ServiceBuilder = new ServiceBuilder(pingPongServiceInfo).setConfigSchema(
	pingPongServiceV1ConfigSchema,
)
