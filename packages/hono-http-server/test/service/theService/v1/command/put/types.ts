import type { z } from 'zod'

import type {
  theServiceV1PutInputParameterSchema,
  theServiceV1PutInputPayloadSchema,
  theServiceV1PutOutputPayloadSchema,
} from './schema'

export type TheServiceV1PutInputParameter = z.input<typeof theServiceV1PutInputParameterSchema>

export type TheServiceV1PutInputPayload = z.input<typeof theServiceV1PutInputPayloadSchema>

export type TheServiceV1PutOutputPayload = z.output<typeof theServiceV1PutOutputPayloadSchema>
