import { z } from 'zod'

export const pingPongServiceV1ConfigSchema = z.object({})

export type PingPongServiceV1Config = z.input<typeof pingPongServiceV1ConfigSchema>
