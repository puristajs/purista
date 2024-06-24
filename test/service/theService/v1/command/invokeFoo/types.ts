import type { z } from 'zod'

import type {
	theServiceV1InvokeFooInputParameterSchema,
	theServiceV1InvokeFooInputPayloadSchema,
	theServiceV1InvokeFooOutputPayloadSchema,
} from './schema.js'

export type TheServiceV1InvokeFooInputParameter = z.input<typeof theServiceV1InvokeFooInputParameterSchema>

export type TheServiceV1InvokeFooInputPayload = z.input<typeof theServiceV1InvokeFooInputPayloadSchema>

export type TheServiceV1InvokeFooOutputPayload = z.output<typeof theServiceV1InvokeFooOutputPayloadSchema>
