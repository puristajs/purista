import type { z } from 'zod'

import type {
  theServiceV1ErrorInputParameterSchema,
  theServiceV1ErrorInputPayloadSchema,
  theServiceV1ErrorOutputPayloadSchema,
} from './schema'

export type TheServiceV1ErrorInputParameter = z.input<typeof theServiceV1ErrorInputParameterSchema>

export type TheServiceV1ErrorInputPayload = z.input<typeof theServiceV1ErrorInputPayloadSchema>

export type TheServiceV1ErrorOutputPayload = z.output<typeof theServiceV1ErrorOutputPayloadSchema>
