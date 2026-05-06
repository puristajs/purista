import type { z } from 'zod'

import type {
	pingV1PingAsyncInputParameterSchema,
	pingV1PingAsyncInputPayloadSchema,
	pingV1PingAsyncOutputPayloadSchema,
} from './schema.js'

export type PingV1PingAsyncInputParameter = z.input<typeof pingV1PingAsyncInputParameterSchema>

export type PingV1PingAsyncInputPayload = z.input<typeof pingV1PingAsyncInputPayloadSchema>

export type PingV1PingAsyncOutputPayload = z.output<typeof pingV1PingAsyncOutputPayloadSchema>
