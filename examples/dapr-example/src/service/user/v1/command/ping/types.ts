import { z } from 'zod'

import { userV1PingInputParameterSchema, userV1PingInputPayloadSchema, userV1PingOutputPayloadSchema } from './schema'

export type UserV1PingInputParameter = z.input<typeof userV1PingInputParameterSchema>

export type UserV1PingInputPayload = z.input<typeof userV1PingInputPayloadSchema>

export type UserV1PingOutputPayload = z.output<typeof userV1PingOutputPayloadSchema>
