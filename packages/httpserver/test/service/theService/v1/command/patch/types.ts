import { z } from 'zod'

import {
  theServiceV1PatchInputParameterSchema,
  theServiceV1PatchInputPayloadSchema,
  theServiceV1PatchOutputPayloadSchema,
} from './schema'

export type TheServiceV1PatchInputParameter = z.input<typeof theServiceV1PatchInputParameterSchema>

export type TheServiceV1PatchInputPayload = z.input<typeof theServiceV1PatchInputPayloadSchema>

export type TheServiceV1PatchOutputPayload = z.output<typeof theServiceV1PatchOutputPayloadSchema>
