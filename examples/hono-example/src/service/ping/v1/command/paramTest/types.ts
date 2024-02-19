import type { z } from 'zod'

import type {
  pingV1ParamTestInputParameterSchema,
  pingV1ParamTestInputPayloadSchema,
  pingV1ParamTestOutputPayloadSchema,
} from './schema.js'

export type PingV1ParamTestInputParameter = z.input<typeof pingV1ParamTestInputParameterSchema>

export type PingV1ParamTestInputPayload = z.input<typeof pingV1ParamTestInputPayloadSchema>

export type PingV1ParamTestOutputPayload = z.output<typeof pingV1ParamTestOutputPayloadSchema>
