import type { z } from 'zod'

import type { pingV1PingJobQueueParameterSchema, pingV1PingJobQueuePayloadSchema } from './schema.js'

export type PingV1PingJobQueuePayload = z.input<typeof pingV1PingJobQueuePayloadSchema>

export type PingV1PingJobQueueParameter = z.input<typeof pingV1PingJobQueueParameterSchema>
