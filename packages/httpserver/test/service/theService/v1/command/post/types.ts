import { z } from 'zod'

import {
  theServiceV1PostInputParameterSchema,
  theServiceV1PostInputPayloadSchema,
  theServiceV1PostOutputPayloadSchema,
} from './schema'

export type TheServiceV1PostInputParameter = z.input<typeof theServiceV1PostInputParameterSchema>

export type TheServiceV1PostInputPayload = z.input<typeof theServiceV1PostInputPayloadSchema>

export type TheServiceV1PostOutputPayload = z.output<typeof theServiceV1PostOutputPayloadSchema>
