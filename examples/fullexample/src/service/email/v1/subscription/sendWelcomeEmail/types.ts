import { z } from 'zod'

import { emailV1SendWelcomeEmailInputPayloadSchema } from './schema'

export type EmailV1SendWelcomeEmailInputPayload = z.output<typeof emailV1SendWelcomeEmailInputPayloadSchema>
