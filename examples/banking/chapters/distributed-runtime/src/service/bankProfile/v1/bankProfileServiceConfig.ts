import { z } from 'zod'

export const bankProfileServiceV1ConfigSchema = z.object({})

export type BankProfileServiceV1Config = z.input<typeof bankProfileServiceV1ConfigSchema>
