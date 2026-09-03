import { z } from 'zod'

export const supportServiceV1ConfigSchema = z.object({})

export type SupportServiceV1Config = z.input<typeof supportServiceV1ConfigSchema>
