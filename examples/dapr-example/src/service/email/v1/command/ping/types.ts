import type { z } from 'zod'

import type {
	emailV1PingInputParameterSchema,
	emailV1PingInputPayloadSchema,
	emailV1PingOutputPayloadSchema,
} from './schema.js'

export type EmailV1PingInputParameter = z.input<typeof emailV1PingInputParameterSchema>

export type EmailV1PingInputPayload = z.input<typeof emailV1PingInputPayloadSchema>

export type EmailV1PingOutputPayload = z.output<typeof emailV1PingOutputPayloadSchema>
