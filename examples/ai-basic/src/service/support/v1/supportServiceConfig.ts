import { extendApi } from '@purista/core'
import { z } from 'zod/v4'

export const supportServiceV1ConfigSchema = extendApi(z.object({}).optional().default({}), {
	title: 'Support service config',
})
