import type { z } from 'zod'

import type {
	pingPongV1PongInputParameterSchema,
	pingPongV1PongInputPayloadSchema,
	pingPongV1PongOutputPayloadSchema,
} from './schema.js'

export type PingPongV1PongInputParameter = z.input<typeof pingPongV1PongInputParameterSchema>

export type PingPongV1PongInputPayload = z.input<typeof pingPongV1PongInputPayloadSchema>

export type PingPongV1PongOutputPayload = z.output<typeof pingPongV1PongOutputPayloadSchema>
