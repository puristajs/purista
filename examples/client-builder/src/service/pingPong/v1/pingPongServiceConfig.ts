import { z } from 'zod/v4'

export const pingPongServiceV1ConfigSchema = z.object({})

export type PingPongServiceV1Config = z.input<typeof pingPongServiceV1ConfigSchema>
