import { HandledError, StatusCode } from '@purista/core'
import { z } from 'zod'

/**
 * The wire contract exposed by the fictitious legacy bank. It deliberately
 * differs from the domain transaction contract used by the banking service.
 */
export const legacyBankTransactionSchema = z.object({
	source_id: z.string().min(1).max(80),
	account_ref: z.enum(['account-a', 'account-c']),
	booked_at: z.string().datetime(),
	amount: z.string().regex(/^\d+\.\d{2}$/),
	currency: z.literal('EUR'),
	dc: z.enum(['D', 'C']),
})

export const legacyBankImportRequestSchema = z.object({
	sourceId: z.string().min(1).max(80),
})

export type LegacyBankTransaction = z.infer<typeof legacyBankTransactionSchema>

/**
 * The application-facing contract for an external legacy-bank adapter.
 * Production code can implement this interface with an HTTP client without
 * changing the command definition or its business guards.
 */
export type LegacyBankClient = {
	getBookedTransaction(sourceId: string): Promise<LegacyBankTransaction>
}

const fixtureTransactions = new Map<string, LegacyBankTransaction>([
	[
		'legacy-bank-debit-a-1',
		{
			source_id: 'legacy-bank-debit-a-1',
			account_ref: 'account-a',
			booked_at: '2026-01-15T12:00:00.000Z',
			amount: '125.40',
			currency: 'EUR',
			dc: 'D',
		},
	],
	[
		'legacy-bank-credit-c-1',
		{
			source_id: 'legacy-bank-credit-c-1',
			account_ref: 'account-c',
			booked_at: '2026-01-16T12:00:00.000Z',
			amount: '50.00',
			currency: 'EUR',
			dc: 'C',
		},
	],
])

/**
 * A deterministic local adapter for this tutorial. The application exposes its
 * fixtures on a separate mock route so readers can inspect the external wire
 * format without an external network dependency.
 */
export class LocalLegacyBankMock implements LegacyBankClient {
	async getBookedTransaction(sourceId: string) {
		const transaction = fixtureTransactions.get(sourceId)
		if (!transaction) throw new HandledError(StatusCode.NotFound, 'The legacy bank transaction does not exist')
		return transaction
	}
}
