import type { z } from 'zod'

import type { supportV1TriageTicketInputPayloadSchema, supportV1TriageTicketOutputPayloadSchema } from './schema.js'

export type SupportV1TriageTicketInputPayload = z.input<typeof supportV1TriageTicketInputPayloadSchema>

export type SupportV1TriageTicketOutputPayload = z.output<typeof supportV1TriageTicketOutputPayloadSchema>
