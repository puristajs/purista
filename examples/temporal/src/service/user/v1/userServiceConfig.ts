import { z } from 'zod'

// define the service config schema and the default service configuration

export const userServiceV1ConfigSchema = z.object({
  taskQueue: z.string(),
  namespace: z.string(),
  connect: z.object({
    address: z.string(),
  }),
})

export type UserServiceV1Config = z.input<typeof userServiceV1ConfigSchema>
