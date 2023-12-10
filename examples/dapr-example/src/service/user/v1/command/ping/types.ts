import type { z } from 'zod'

import type {
  userV1PingInputParameterSchema,
  userV1PingInputPayloadSchema,
  userV1PingOutputPayloadSchema,
} from './schema.js'

export type UserV1PingInputParameter = z.input<typeof userV1PingInputParameterSchema>

export type UserV1PingInputPayload = z.input<typeof userV1PingInputPayloadSchema>

export type UserV1PingOutputPayload = z.output<typeof userV1PingOutputPayloadSchema>
