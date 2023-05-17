import { z } from 'zod'

import { pingV1LogInputPayloadSchema } from './schema'

export type PingV1LogInputPayload = z.output<typeof pingV1LogInputPayloadSchema>
