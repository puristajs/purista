import type { z } from 'zod/v4'

import type { emailV1SendWelcomeEmailInputPayloadSchema } from './schema.js'

export type EmailV1SendWelcomeEmailInputPayload = z.output<typeof emailV1SendWelcomeEmailInputPayloadSchema>
