import { ServiceBuilder, type ServiceInfoType } from '@purista/core'
import { generalSupportServiceInfo } from '../generalSupportServiceInfo.js'
import type { SupportConversationHistory } from './SupportConversationHistory.js'
import type { SupportConversationPolicy } from './SupportConversationPolicy.js'
import { supportServiceV1ConfigSchema } from './supportServiceConfig.js'

export const supportServiceInfo = {
	serviceVersion: '1',
	...generalSupportServiceInfo,
} as const satisfies ServiceInfoType

export const supportV1ServiceBuilder = new ServiceBuilder(supportServiceInfo)
	.setConfigSchema(supportServiceV1ConfigSchema)
	.defineResource<'supportConversationHistory', SupportConversationHistory>()
	.defineResource<'supportConversationPolicy', SupportConversationPolicy>()
