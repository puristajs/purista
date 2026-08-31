import { expect, test } from 'vitest'
import { AccountAccess } from '../../../../../accountAccess.js'
import { fixtureIdentities, type Identity } from '../../../../../identity.js'
import { maximumCsvRows } from '../../../../../statementCsv.js'
import { createTestBank } from '../../../../../testing/createTestBank.js'
import type { RecordedTransaction, TransactionInput } from '../../../../../transaction.js'
import { TransactionRepository } from '../../../../../transactionRepository.js'

const transaction: TransactionInput = {
	accountId: 'account-a',
	sourceTransactionId: '=SUM(1,2)',
	bookedAt: '2026-01-15T12:00:00.000Z',
	amountMinor: 12540,
	currency: 'EUR',
	direction: 'debit',
}

test('CSV contains only fixed columns and safely represents untrusted source identifiers', async () => {
	const bank = await createTestBank()
	try {
		const first = bank.transactions.record(fixtureIdentities.dana, transaction)
		const second = bank.transactions.record(fixtureIdentities.dana, {
			...transaction,
			sourceTransactionId: 'memo "travel", desk\nline 2',
		})
		const bob = await bank.login('bob')
		const response = await bob.request('/api/v1/accounts/account-a/statement.csv')
		expect(response.status).toBe(200)
		expect(response.headers.get('content-type')).toBe('text/csv; charset=utf-8')
		expect(response.headers.get('content-disposition')).toBe('attachment; filename="statement.csv"')
		const csv = await response.text()
		expect(csv).toBe(
			'transactionId,sourceTransactionId,bookedAt,amountMinor,currency,direction\r\n' +
				'"' +
				first.transactionId +
				'","\'=SUM(1,2)","2026-01-15T12:00:00.000Z",12540,"EUR","debit"\r\n' +
				'"' +
				second.transactionId +
				'","memo ""travel"", desk\nline 2","2026-01-15T12:00:00.000Z",12540,"EUR","debit"\r\n',
		)
		expect(csv).not.toContain('tenant-north')
		expect((await bob.request('/api/v1/accounts/account-c/statement.csv')).status).toBe(403)
		bank.access.revoke(fixtureIdentities.bob, 'account-a', 'read')
		expect((await bob.request('/api/v1/accounts/account-a/statement.csv')).status).toBe(403)
	} finally {
		await bank.destroy()
	}
})

test('an after guard prevents wrong-tenant rows from reaching CSV', async () => {
	class IncorrectRepository extends TransactionRepository {
		override list(identity: Identity, accountId: TransactionInput['accountId']): RecordedTransaction[] {
			return super.list(identity, accountId).map(row => ({ ...row, tenantId: 'tenant-south' }))
		}
	}
	const access = new AccountAccess()
	const transactions = new IncorrectRepository(access)
	transactions.record(fixtureIdentities.dana, transaction)
	const bank = await createTestBank({ access, transactions })
	try {
		const bob = await bank.login('bob')
		const response = await bob.request('/api/v1/accounts/account-a/statement.csv')
		expect(response.status).toBe(403)
		expect(response.headers.get('content-type')).toContain('application/problem+json')
		expect(await response.text()).not.toContain('SUM')
	} finally {
		await bank.destroy()
	}
})

test('large synchronous exports fail instead of silently losing rows', async () => {
	const bank = await createTestBank()
	try {
		for (let index = 0; index <= maximumCsvRows; index++) {
			bank.transactions.record(fixtureIdentities.dana, { ...transaction, sourceTransactionId: 'row-' + index })
		}
		const bob = await bank.login('bob')
		const response = await bob.request('/api/v1/accounts/account-a/statement.csv')
		expect(response.status).toBe(413)
		expect(response.headers.get('content-type')).toContain('application/problem+json')
		expect(bank.transactions.list(fixtureIdentities.dana, 'account-a')).toHaveLength(maximumCsvRows + 1)
	} finally {
		await bank.destroy()
	}
})
