import { z } from 'zod'

import {
  userV1GetUserByIdInputParameterSchema,
  userV1GetUserByIdInputPayloadSchema,
  userV1GetUserByIdOutputPayloadSchema,
} from './schema'

export type UserV1GetUserByIdInputParameter = z.input<typeof userV1GetUserByIdInputParameterSchema>

export type UserV1GetUserByIdInputPayload = z.input<typeof userV1GetUserByIdInputPayloadSchema>

export type UserV1GetUserByIdOutputPayload = z.output<typeof userV1GetUserByIdOutputPayloadSchema>
