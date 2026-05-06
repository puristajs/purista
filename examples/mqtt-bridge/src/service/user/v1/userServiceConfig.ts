import { z } from 'zod'

// define the service config schema and the default service configuration

export const userServiceV1ConfigSchema = z.object({})

export type UserServiceV1Config = z.input<typeof userServiceV1ConfigSchema>
