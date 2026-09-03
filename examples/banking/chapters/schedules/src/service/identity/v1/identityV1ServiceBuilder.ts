import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'
import { generalIdentityServiceInfo } from '../generalIdentityServiceInfo.js'
import type { LocalIdentityProvider } from './LocalIdentityProvider.js'
import { identityServiceV1ConfigSchema } from './identityServiceConfig.js'

export const identityServiceInfo = {
	serviceVersion: '1',
	...generalIdentityServiceInfo,
} as const satisfies ServiceInfoType

export const identityV1ServiceBuilder = new ServiceBuilder(identityServiceInfo)
	.setConfigSchema(identityServiceV1ConfigSchema)
	.defineResource<'identityProvider', LocalIdentityProvider>()
