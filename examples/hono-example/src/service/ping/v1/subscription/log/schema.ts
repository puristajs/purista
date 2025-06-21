import { extendApi } from '@purista/core'
import { z } from 'zod/v4'

// define the input payload
export const pingV1LogInputPayloadSchema = extendApi(
	z.object({
		pong: extendApi(z.string(), { title: 'Pong' }),
	}),
	{ title: 'pong payload schema' },
)
