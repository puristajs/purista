import { z } from 'zod'

import {
  emailV1PingInputParameterSchema,
  emailV1PingInputPayloadSchema,
  emailV1PingOutputPayloadSchema,
} from './schema'

export type EmailV1PingInputParameter = z.input<typeof emailV1PingInputParameterSchema>

export type EmailV1PingInputPayload = z.input<typeof emailV1PingInputPayloadSchema>

export type EmailV1PingOutputPayload = z.output<typeof emailV1PingOutputPayloadSchema>
