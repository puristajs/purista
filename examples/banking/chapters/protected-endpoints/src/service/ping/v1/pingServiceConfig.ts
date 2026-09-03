import { z } from 'zod'

export const pingServiceV1ConfigSchema = z.object({})

export type PingServiceV1Config = z.input<typeof pingServiceV1ConfigSchema>
