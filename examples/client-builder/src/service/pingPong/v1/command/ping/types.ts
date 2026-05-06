import type { z } from 'zod'

import type {
	pingPongV1PingInputParameterSchema,
	pingPongV1PingInputPayloadSchema,
	pingPongV1PingOutputPayloadSchema,
} from './schema.js'

export type PingPongV1PingInputParameter = z.input<typeof pingPongV1PingInputParameterSchema>

export type PingPongV1PingInputPayload = z.input<typeof pingPongV1PingInputPayloadSchema>

export type PingPongV1PingOutputPayload = z.output<typeof pingPongV1PingOutputPayloadSchema>
