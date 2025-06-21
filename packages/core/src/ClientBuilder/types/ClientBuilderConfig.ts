import type { z } from 'zod/v4'

import type { httpClientConfigSchema } from '../schema/httpClientConfigSchema.js'

export type ClientBuilderConfig = z.infer<typeof httpClientConfigSchema>
