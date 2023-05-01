import { z } from 'zod'

// define the service config schema and the default service configuration

export const theServiceServiceV1ConfigSchema = z.object({})

export type TheServiceServiceV1Config = z.input<typeof theServiceServiceV1ConfigSchema>
