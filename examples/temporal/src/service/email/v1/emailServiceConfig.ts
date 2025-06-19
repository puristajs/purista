import { z } from 'zod/v4'

// define the service config schema and the default service configuration

export const emailServiceV1ConfigSchema = z.object({})

export type EmailServiceV1Config = z.input<typeof emailServiceV1ConfigSchema>
