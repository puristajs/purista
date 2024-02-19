import type { z } from 'zod'

import type {
  theServiceV1FooInputParameterSchema,
  theServiceV1FooInputPayloadSchema,
  theServiceV1FooOutputPayloadSchema,
} from './schema.js'

export type TheServiceV1FooInputParameter = z.input<typeof theServiceV1FooInputParameterSchema>

export type TheServiceV1FooInputPayload = z.input<typeof theServiceV1FooInputPayloadSchema>

export type TheServiceV1FooOutputPayload = z.output<typeof theServiceV1FooOutputPayloadSchema>
