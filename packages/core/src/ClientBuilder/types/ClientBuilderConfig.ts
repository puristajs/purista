import type { z } from 'zod'

import type { httpClientConfigSchema } from '../schema/httpClientConfigSchema.js'

export type ClientBuilderConfig = z.infer<typeof httpClientConfigSchema>
