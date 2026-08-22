import type { ServiceInfoType } from '@purista/core/adapter'
import { ServiceBuilder } from '@purista/core/adapter'

import { generalHonoServiceInfo } from '../generalHonoServiceInfo.js'
import { HonoServiceClass } from './HonoServiceClass.js'
import { honoServiceV1ConfigSchema } from './honoServiceConfig.js'

/**
 * Service metadata for version 1 of the built-in Hono HTTP service.
 */
export const honoServiceInfo: ServiceInfoType = {
	serviceVersion: '1',
	...generalHonoServiceInfo,
}

/**
 * Builder for the built-in Hono HTTP service.
 *
 * Applications normally use {@link honoV1Service} and call `getInstance(...)`
 * to create a {@link HonoServiceClass}.
 */
export const honoV1ServiceBuilder = new ServiceBuilder(honoServiceInfo)
	.setConfigSchema(honoServiceV1ConfigSchema)
	.setCustomClass(HonoServiceClass)
