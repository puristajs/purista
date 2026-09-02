import { z } from 'zod'

export const knowledgeServiceV1ConfigSchema = z.object({})

export type KnowledgeServiceV1Config = z.input<typeof knowledgeServiceV1ConfigSchema>
