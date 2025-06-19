import { z } from 'zod/v4'

// define the service config schema and the default service configuration

export const cardServiceV1ConfigSchema = z.object({})

export type CardServiceV1Config = z.input<typeof cardServiceV1ConfigSchema>
