import { z } from 'zod'

import { pingV1PingInputParameterSchema, pingV1PingInputPayloadSchema, pingV1PingOutputPayloadSchema } from './schema'

export type PingV1PingInputParameter = z.input<typeof pingV1PingInputParameterSchema>

export type PingV1PingInputPayload = z.input<typeof pingV1PingInputPayloadSchema>

export type PingV1PingOutputPayload = z.output<typeof pingV1PingOutputPayloadSchema>
