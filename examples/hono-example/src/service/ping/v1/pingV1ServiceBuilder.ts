import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'
import { z } from 'zod'

import { generalPingServiceInfo } from '../generalPingServiceInfo.js'
import { pingServiceV1ConfigSchema } from './pingServiceConfig.js'

export const pingServiceInfo = {
	serviceVersion: '1',
	...generalPingServiceInfo,
} as const satisfies ServiceInfoType

// create a service builder instance and assign service config schema and default config.

const pingMetricAttributesSchema = z.object({
	route: z.enum(['ping']),
})

export const pingV1ServiceBuilder = new ServiceBuilder(pingServiceInfo)
	.setConfigSchema(pingServiceV1ConfigSchema)
	.defineMetric('app.hono.requests', {
		kind: 'counter',
		unit: '{request}',
		description: 'Ping requests handled by the Hono example',
		attributes: pingMetricAttributesSchema,
	})
