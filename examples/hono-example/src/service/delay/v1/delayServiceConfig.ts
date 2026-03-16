import { z } from 'zod'

// define the service config schema and the default service configuration

export const delayServiceV1ConfigSchema = z.object({})

export type DelayServiceV1Config = z.input<typeof delayServiceV1ConfigSchema>
