import { z } from 'zod'

export const analysisServiceV1ConfigSchema = z.object({})

export type AnalysisServiceV1Config = z.input<typeof analysisServiceV1ConfigSchema>
