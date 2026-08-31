import { z } from 'zod'

import type { ReconciliationSource } from '../repository.js'

/** Business events shared by the later banking tutorial chapters. */
export const BankingTutorialEvent = {
	transactionRecorded: 'banking.transaction.recorded',
	reconciliationDue: 'banking.reconciliation.due',
} as const

export const accountIdSchema = z.enum(['account-a', 'account-c'])

/**
 * A deliberately small event contract. Consumers receive the fact they need,
 * rather than a copy of every field returned by the transaction HTTP API.
 */
export const transactionRecordedEventSchema = z.object({
	transactionId: z.string().min(1),
	accountId: accountIdSchema,
	amountMinor: z.number().int().positive(),
	currency: z.literal('EUR'),
	direction: z.enum(['debit', 'credit']),
	bookedAt: z.string().datetime(),
})

/**
 * Schedule triggers carry an occurrence and a source. Together they identify
 * one local reconciliation run and let the command guard check the exact
 * operations assignment before it enqueues work.
 */
export const reconciliationDueEventSchema = z.object({
	day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	source: z.literal('banking-projections') satisfies z.ZodType<ReconciliationSource>,
})
