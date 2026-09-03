import { createStreamContextMock } from '@purista/core'
import { expect, test } from 'vitest'
import { summarizeTransactionsStreamBuilder } from './summarizeTransactionsStreamBuilder.js'

const rows = [
	{ transactionId: '4cb54a52-0416-41b1-acbc-9be2aa4a19d2', amountCents: 2_500,
		direction: 'debit' as const, counterparty: 'Northwind Books', recordedAt: '2026-01-03T10:00:00.000Z' },
	{ transactionId: 'e4fd9d5c-fe60-41b4-8958-d61981857ee0', amountCents: 8_000,
		direction: 'credit' as const, counterparty: 'Example Payroll', recordedAt: '2026-01-02T10:00:00.000Z' },
]

test('writes ordered progress and a final summary', async () => {
	const reader = { canReadAccount: async () => true, listRecent: async () => rows }
	const mocked = createStreamContextMock(summarizeTransactionsStreamBuilder, {
		payload: undefined,
		parameter: { accountId: 'account-operating' },
		resources: { transactionAnalysisReader: reader },
	})
	await summarizeTransactionsStreamBuilder.getStreamFunction().call(
		{} as never, mocked.context, undefined, { accountId: 'account-operating' }, mocked.writer,
	)
	expect(mocked.chunks).toEqual([
		{ stage: 'loading', completed: 0, total: 0 },
		{ stage: 'summarizing', completed: 1, total: 2 },
		{ stage: 'summarizing', completed: 2, total: 2 },
		{ stage: 'complete', completed: 2, total: 2, summary: {
			accountId: 'account-operating', transactionCount: 2,
			creditCents: 8_000, debitCents: 2_500, netCents: 5_500,
		} },
	])
	expect(mocked.finalValue).toEqual({
		accountId: 'account-operating', transactionCount: 2,
		creditCents: 8_000, debitCents: 2_500, netCents: 5_500,
	})
})

test('the business guard denies an account outside the caller scope', async () => {
	const reader = { canReadAccount: async () => false, listRecent: async () => rows }
	const mocked = createStreamContextMock(summarizeTransactionsStreamBuilder, {
		payload: undefined,
		parameter: { accountId: 'account-private' },
		resources: { transactionAnalysisReader: reader },
	})
	const guard = summarizeTransactionsStreamBuilder.getBeforeGuardHook('accountAccess')
	await expect(guard.call(
		{} as never, mocked.context, undefined, { accountId: 'account-private' },
	)).rejects.toThrow('This account is not available for analysis')
	expect(mocked.chunks).toEqual([])
})

test('passes cancellation to a pending resource and does not close', async () => {
	let resourceWasCancelled = false
	let resourceStarted = () => {}
	const started = new Promise<void>(resolve => { resourceStarted = resolve })
	const reader = {
		canReadAccount: async () => true,
		listRecent: async (_scope: unknown, _limit: number, signal?: AbortSignal) => {
			resourceStarted()
			return new Promise<typeof rows>(resolve => {
				signal?.addEventListener('abort', () => {
					resourceWasCancelled = true
					resolve([])
				}, { once: true })
			})
		},
	}
	const mocked = createStreamContextMock(summarizeTransactionsStreamBuilder, {
		payload: undefined,
		parameter: { accountId: 'account-operating' },
		resources: { transactionAnalysisReader: reader },
	})
	const execution = summarizeTransactionsStreamBuilder.getStreamFunction().call(
		{} as never, mocked.context, undefined, { accountId: 'account-operating' }, mocked.writer,
	)
	await started
	mocked.cancel('test client disconnected')
	await execution

	expect(resourceWasCancelled).toBe(true)
	expect(mocked.chunks).toEqual([{ stage: 'loading', completed: 0, total: 0 }])
	expect(mocked.finalValue).toBeUndefined()
})
