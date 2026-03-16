import type { z } from 'zod'

import type { emailV1SendWelcomeEmailInputPayloadSchema } from './schema.js'

export type EmailV1SendWelcomeEmailInputPayload = z.output<typeof emailV1SendWelcomeEmailInputPayloadSchema>
