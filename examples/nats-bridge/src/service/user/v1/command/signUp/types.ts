import { z } from 'zod'

import {
  userV1SignUpInputParameterSchema,
  userV1SignUpInputPayloadSchema,
  userV1SignUpOutputPayloadSchema,
} from './schema'

export type UserV1SignUpInputParameter = z.input<typeof userV1SignUpInputParameterSchema>

export type UserV1SignUpInputPayload = z.input<typeof userV1SignUpInputPayloadSchema>

export type UserV1SignUpOutputPayload = z.output<typeof userV1SignUpOutputPayloadSchema>
