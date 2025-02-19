import type { z } from 'zod'

import type {
	userV1ComputeDataInputParameterSchema,
	userV1ComputeDataInputPayloadSchema,
	userV1ComputeDataOutputPayloadSchema,
} from './schema.js'

export type UserV1ComputeDataInputParameter = z.input<typeof userV1ComputeDataInputParameterSchema>

export type UserV1ComputeDataInputPayload = z.input<typeof userV1ComputeDataInputPayloadSchema>

export type UserV1ComputeDataOutputPayload = z.output<typeof userV1ComputeDataOutputPayloadSchema>
