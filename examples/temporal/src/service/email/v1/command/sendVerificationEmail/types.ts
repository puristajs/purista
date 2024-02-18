import type { z } from 'zod'

import type {
  emailV1SendVerificationEmailInputParameterSchema,
  emailV1SendVerificationEmailInputPayloadSchema,
  emailV1SendVerificationEmailOutputPayloadSchema,
} from './schema.js'

export type EmailV1SendVerificationEmailInputParameter = z.input<
  typeof emailV1SendVerificationEmailInputParameterSchema
>

export type EmailV1SendVerificationEmailInputPayload = z.input<typeof emailV1SendVerificationEmailInputPayloadSchema>

export type EmailV1SendVerificationEmailOutputPayload = z.output<typeof emailV1SendVerificationEmailOutputPayloadSchema>
