import { z } from 'zod'

export const freezeCardInputSchema = z.strictObject({ cardId: z.string() })
export const freezeCardParameterSchema = z.strictObject({ idempotencyKey: z.string().min(1).max(200) })
export const freezeCardOutputSchema = z.strictObject({ status: z.literal('frozen'), cardId: z.string() })
