import type { z } from 'zod'

import type {
  delayV1FooBarInputParameterSchema,
  delayV1FooBarInputPayloadSchema,
  delayV1FooBarOutputPayloadSchema,
} from './schema.js'

export type DelayV1FooBarInputParameter = z.input<typeof delayV1FooBarInputParameterSchema>

export type DelayV1FooBarInputPayload = z.input<typeof delayV1FooBarInputPayloadSchema>

export type DelayV1FooBarOutputPayload = z.output<typeof delayV1FooBarOutputPayloadSchema>
