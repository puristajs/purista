import { z } from 'zod'

// define the service config schema and the default service configuration

export const accountServiceV1ConfigSchema = z.object({})

export type AccountServiceV1Config = z.input<typeof accountServiceV1ConfigSchema>
