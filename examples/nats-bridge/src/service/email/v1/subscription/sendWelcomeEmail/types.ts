import type { z } from 'zod'

import type { emailV1SendWelcomeEmailInputPayloadSchema } from './schema'

export type EmailV1SendWelcomeEmailInputPayload = z.output<typeof emailV1SendWelcomeEmailInputPayloadSchema>
