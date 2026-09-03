import { ServiceBuilder } from '@purista/core'
import { z } from 'zod'

export const identityV1ServiceBuilder = new ServiceBuilder({
	serviceName: 'Identity',
	serviceVersion: '1',
	serviceDescription: 'Authenticates local tutorial users and owns sessions',
}).setConfigSchema(
	z.object({
		sessionTtlMs: z
			.number()
			.int()
			.positive()
			.default(15 * 60 * 1000),
	}),
)
