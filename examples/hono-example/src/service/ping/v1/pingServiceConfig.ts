import { z } from 'zod'

// define the service config schema and the default service configuration

export const pingServiceV1ConfigSchema = z.object({})

export type PingServiceV1Config = z.input<typeof pingServiceV1ConfigSchema>
