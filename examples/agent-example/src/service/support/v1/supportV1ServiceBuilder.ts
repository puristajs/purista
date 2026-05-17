import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'

import type { IncidentRepository } from '../../../resource/incidentRepository.js'
import { generalSupportServiceInfo } from '../generalSupportServiceInfo.js'
import { supportServiceV1ConfigSchema } from './supportServiceConfig.js'

export const supportServiceInfo = {
	serviceVersion: '1',
	...generalSupportServiceInfo,
} as const satisfies ServiceInfoType

export const supportV1ServiceBuilder = new ServiceBuilder(supportServiceInfo)
	.setConfigSchema(supportServiceV1ConfigSchema)
	.defineResource<'incidentRepository', IncidentRepository>()
