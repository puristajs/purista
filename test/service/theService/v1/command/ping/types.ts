import { z } from 'zod'

import {
  theServiceV1PingInputParameterSchema,
  theServiceV1PingInputPayloadSchema,
  theServiceV1PingOutputPayloadSchema,
} from './schema'

export type TheServiceV1PingInputParameter = z.input<typeof theServiceV1PingInputParameterSchema>

export type TheServiceV1PingInputPayload = z.input<typeof theServiceV1PingInputPayloadSchema>

export type TheServiceV1PingOutputPayload = z.output<typeof theServiceV1PingOutputPayloadSchema>
