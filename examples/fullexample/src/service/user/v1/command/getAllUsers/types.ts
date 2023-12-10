import type { z } from 'zod'

import type {
  userV1GetAllUsersInputParameterSchema,
  userV1GetAllUsersInputPayloadSchema,
  userV1GetAllUsersOutputPayloadSchema,
} from './schema.js'

export type UserV1GetAllUsersInputParameter = z.input<typeof userV1GetAllUsersInputParameterSchema>

export type UserV1GetAllUsersInputPayload = z.input<typeof userV1GetAllUsersInputPayloadSchema>

export type UserV1GetAllUsersOutputPayload = z.output<typeof userV1GetAllUsersOutputPayloadSchema>
