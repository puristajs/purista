import { z } from 'zod'

import {
  theServiceV1DeleteInputParameterSchema,
  theServiceV1DeleteInputPayloadSchema,
  theServiceV1DeleteOutputPayloadSchema,
} from './schema'

export type TheServiceV1DeleteInputParameter = z.input<typeof theServiceV1DeleteInputParameterSchema>

export type TheServiceV1DeleteInputPayload = z.input<typeof theServiceV1DeleteInputPayloadSchema>

export type TheServiceV1DeleteOutputPayload = z.output<typeof theServiceV1DeleteOutputPayloadSchema>
