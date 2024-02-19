import type { z } from 'zod'

import type {
  pingV1FooInputParameterSchema,
  pingV1FooInputPayloadSchema,
  pingV1FooOutputPayloadSchema,
} from './schema.js'

export type PingV1FooInputParameter = z.input<typeof pingV1FooInputParameterSchema>

export type PingV1FooInputPayload = z.input<typeof pingV1FooInputPayloadSchema>

export type PingV1FooOutputPayload = z.output<typeof pingV1FooOutputPayloadSchema>
