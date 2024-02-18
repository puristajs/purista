import type { z } from 'zod'

import type {
  accountV1CreateAccountInputParameterSchema,
  accountV1CreateAccountInputPayloadSchema,
  accountV1CreateAccountOutputPayloadSchema,
} from './schema.js'

export type AccountV1CreateAccountInputParameter = z.input<typeof accountV1CreateAccountInputParameterSchema>

export type AccountV1CreateAccountInputPayload = z.input<typeof accountV1CreateAccountInputPayloadSchema>

export type AccountV1CreateAccountOutputPayload = z.output<typeof accountV1CreateAccountOutputPayloadSchema>
