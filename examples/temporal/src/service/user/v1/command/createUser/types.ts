import type { z } from 'zod'

import type {
  userV1CreateUserInputParameterSchema,
  userV1CreateUserInputPayloadSchema,
  userV1CreateUserOutputPayloadSchema,
} from './schema.js'

export type UserV1CreateUserInputParameter = z.input<typeof userV1CreateUserInputParameterSchema>

export type UserV1CreateUserInputPayload = z.input<typeof userV1CreateUserInputPayloadSchema>

export type UserV1CreateUserOutputPayload = z.output<typeof userV1CreateUserOutputPayloadSchema>
