import { HandledError, StatusCode } from '@purista/core'
import { z } from 'zod'
import { accountIdSchema, type TransactionInput } from './transaction.js'

export const legacyTransactionSchema = z.object({
	source_id: z.string().min(1).max(80),
	account_ref: accountIdSchema,
	booked_at: z.iso.datetime(),
	amount: z
		.string()
		.max(32)
		.regex(/^[0-9]+\.[0-9]{2}$/),
	currency: z.literal('EUR'),
	dc: z.enum(['D', 'C']),
})
export type LegacyTransaction = z.infer<typeof legacyTransactionSchema>

/** Convert one validated wire record without I/O or permission decisions. */
export function fromLegacyTransaction(input: LegacyTransaction): TransactionInput {
	const minor = BigInt(input.amount.replace('.', ''))
	if (minor > BigInt(Number.MAX_SAFE_INTEGER)) {
		throw new HandledError(StatusCode.BadRequest, 'The legacy amount is outside the supported range')
	}
	return {
		sourceTransactionId: input.source_id,
		accountId: input.account_ref,
		bookedAt: input.booked_at,
		amountMinor: Number(minor),
		currency: input.currency,
		direction: input.dc === 'D' ? 'debit' : 'credit',
	}
}
