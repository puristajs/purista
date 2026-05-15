import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/core'
import { z } from 'zod'

import { generalUserServiceInfo } from '../generalUserServiceInfo.js'
import { userServiceV1ConfigSchema } from './userServiceConfig.js'

export const userServiceInfo = {
	serviceVersion: '1',
	...generalUserServiceInfo,
} as const satisfies ServiceInfoType

// create a service builder instance and assign service config schema and default config.

const userMetricAttributesSchema = z.object({
	source: z.enum(['http']),
})

export const userV1ServiceBuilder = new ServiceBuilder(userServiceInfo)
	.setConfigSchema(userServiceV1ConfigSchema)
	.defineMetric('app.users.signup', {
		kind: 'counter',
		unit: '{user}',
		description: 'Users signed up through the full example',
		attributes: userMetricAttributesSchema,
	})
