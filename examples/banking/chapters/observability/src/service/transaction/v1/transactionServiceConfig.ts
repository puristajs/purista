import { z } from 'zod'

export const transactionServiceV1ConfigSchema = z.object({})

export type TransactionServiceV1Config = z.input<typeof transactionServiceV1ConfigSchema>
