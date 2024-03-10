import type { z } from 'zod'

import type { configFullSchema, configSchema } from '../schema/configSchema.js'

export type Config = z.infer<typeof configSchema>

export type ConfigFull = z.infer<typeof configFullSchema>
