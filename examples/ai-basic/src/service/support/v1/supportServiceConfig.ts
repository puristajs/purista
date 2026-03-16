import { extendApi } from '@purista/core'
import { z } from 'zod'

export const supportServiceV1ConfigSchema = extendApi(z.object({}).optional().default({}), {
	title: 'Support service config',
})
