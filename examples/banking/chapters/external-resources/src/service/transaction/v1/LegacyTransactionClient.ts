import { z } from 'zod'

export const legacyTransactionProviderResponseSchema = z.strictObject({
	sourceId: z.string().trim().min(1).max(80),
	record: z.string().trim().min(1).max(240),
})

export interface LegacyTransactionClient {
	fetchTransaction(sourceId: string, accessToken: string): Promise<string>
}
