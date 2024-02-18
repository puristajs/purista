import type { z } from 'zod'

import type {
  emailV1ConfirmEmailInputParameterSchema,
  emailV1ConfirmEmailInputPayloadSchema,
  emailV1ConfirmEmailOutputPayloadSchema,
} from './schema.js'

export type EmailV1ConfirmEmailInputParameter = z.input<typeof emailV1ConfirmEmailInputParameterSchema>

export type EmailV1ConfirmEmailInputPayload = z.input<typeof emailV1ConfirmEmailInputPayloadSchema>

export type EmailV1ConfirmEmailOutputPayload = z.output<typeof emailV1ConfirmEmailOutputPayloadSchema>
