import { expect, test } from 'vitest'
import { AccountAccess, type AccountAction } from './accountAccess.js'
import { fixtureIdentities, type Identity } from './identity.js'
import { createTestBank } from './testing/createTestBank.js'
import type { RecordedTransaction, TransactionInput } from './transaction.js'
import { TransactionRepository } from './transactionRepository.js'

const transaction: TransactionInput = {
	accountId: 'account-a',
	sourceTransactionId: 'source-001',
	bookedAt: '2026-01-20T10:00:00.000Z',
	amountMinor: 1250,
	currency: 'EUR',
	direction: 'debit',
}

test('revocation between the before guard and the write prevents the write', async () => {
	class RevokingAccess extends AccountAccess {
		override assertAllowed(identity: Identity, accountId: TransactionInput['accountId'], action: AccountAction) {
			super.assertAllowed(identity, accountId, action)
			if (action === 'record') this.revoke(identity, accountId, action)
		}
	}
	const bank = await createTestBank({ access: new RevokingAccess() })
	try {
		const dana = await bank.login('dana')
		const response = await dana.request('/api/v1/transactions', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(transaction),
		})
		expect(response.status).toBe(403)
		expect(bank.transactions.list(fixtureIdentities.dana, 'account-a')).toEqual([])
	} finally {
		await bank.destroy()
	}
})

test('a failed permission dependency denies access without leaking its error', async () => {
	class UnavailableAccess extends AccountAccess {
		override assertAllowed(): void {
			throw new Error('private-policy-database-address')
		}
	}
	const bank = await createTestBank({ access: new UnavailableAccess() })
	try {
		const bob = await bank.login('bob')
		const response = await bob.request('/api/v1/accounts/account-a/transactions')
		expect(response.status).toBe(500)
		const body = await response.text()
		expect(body).not.toContain('private-policy-database-address')
		expect(JSON.parse(body)).not.toHaveProperty('transactions')
	} finally {
		await bank.destroy()
	}
})

test.each([
	{ tenantId: 'tenant-south', accountId: 'account-a' as const },
	{ tenantId: 'tenant-north', accountId: 'account-c' as const },
])('the after guard rejects a schema-valid row outside $tenantId/$accountId', async foreignScope => {
	class IncorrectRepository extends TransactionRepository {
		override list(identity: Identity, accountId: TransactionInput['accountId']): RecordedTransaction[] {
			return super.list(identity, accountId).map(row => ({ ...row, ...foreignScope }))
		}
	}
	const access = new AccountAccess()
	const transactions = new IncorrectRepository(access)
	transactions.record(fixtureIdentities.dana, transaction)
	const bank = await createTestBank({ access, transactions })
	try {
		const bob = await bank.login('bob')
		const response = await bob.request('/api/v1/accounts/account-a/transactions')
		expect(response.status).toBe(403)
		expect(await response.text()).not.toContain('source-001')
	} finally {
		await bank.destroy()
	}
})

test('calling the event bridge directly does not skip command business guards', async () => {
	const bank = await createTestBank()
	try {
		const command = {
			contentType: 'application/json',
			contentEncoding: 'utf-8',
			sender: {
				serviceName: 'Test',
				serviceVersion: '1',
				serviceTarget: 'read',
				instanceId: bank.eventBridge.instanceId,
			},
			receiver: { serviceName: 'Banking', serviceVersion: '1', serviceTarget: 'listTransactions' },
			payload: { payload: undefined, parameter: { accountId: 'account-c' } },
		}
		await expect(bank.eventBridge.invoke(command)).rejects.toMatchObject({ errorCode: 401 })
		await expect(bank.eventBridge.invoke({ ...command, ...fixtureIdentities.bob })).rejects.toMatchObject({
			errorCode: 403,
		})
	} finally {
		await bank.destroy()
	}
})
