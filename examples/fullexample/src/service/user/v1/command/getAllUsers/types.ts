import { z } from 'zod'

import {
  userV1GetAllUsersInputParameterSchema,
  userV1GetAllUsersInputPayloadSchema,
  userV1GetAllUsersOutputPayloadSchema,
} from './schema'

export type UserV1GetAllUsersInputParameter = z.input<typeof userV1GetAllUsersInputParameterSchema>

export type UserV1GetAllUsersInputPayload = z.input<typeof userV1GetAllUsersInputPayloadSchema>

export type UserV1GetAllUsersOutputPayload = z.output<typeof userV1GetAllUsersOutputPayloadSchema>
