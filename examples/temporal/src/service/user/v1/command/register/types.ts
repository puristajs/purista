import type { z } from 'zod'

import type {
	userV1RegisterInputParameterSchema,
	userV1RegisterInputPayloadSchema,
	userV1RegisterOutputPayloadSchema,
} from './schema.js'

export type UserV1RegisterInputParameter = z.input<typeof userV1RegisterInputParameterSchema>

export type UserV1RegisterInputPayload = z.input<typeof userV1RegisterInputPayloadSchema>

export type UserV1RegisterOutputPayload = z.output<typeof userV1RegisterOutputPayloadSchema>
