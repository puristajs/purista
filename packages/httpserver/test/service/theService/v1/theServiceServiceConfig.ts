import { z } from 'zod/v4'

// define the service config schema and the default service configuration

export const theServiceServiceV1ConfigSchema = z.object({})

export type TheServiceServiceV1Config = z.input<typeof theServiceServiceV1ConfigSchema>
