import { expect, test } from 'vitest'
import { AccountAccess, type AccountAction } from '../../../../../accountAccess.js'
import { fixtureIdentities, type Identity } from '../../../../../identity.js'
import { createTestBank } from '../../../../../testing/createTestBank.js'
import type { TransactionInput } from '../../../../../transaction.js'

test('nested commands keep tenant and principal identity and enforce their own guards', async () => {
	const bank = await createTestBank()
	try {
		bank.transactions.record(fixtureIdentities.dana, {
			accountId: 'account-a',
			sourceTransactionId: 'source-001',
			bookedAt: '2026-01-20T10:00:00.000Z',
			amountMinor: 1250,
			currency: 'EUR',
			direction: 'debit',
		})
		const bob = await bank.login('bob')
		const south = await bank.login('danaSouth')
		const northResult = await bob.request('/api/v1/accounts/account-a/overview')
		expect(northResult.status).toBe(200)
		expect(await northResult.json()).toEqual({ tenantId: 'tenant-north', accountId: 'account-a', transactionCount: 1 })
		const southResult = await south.request('/api/v1/accounts/account-a/overview')
		expect(southResult.status).toBe(200)
		expect(await southResult.json()).toEqual({ tenantId: 'tenant-south', accountId: 'account-a', transactionCount: 0 })
		expect((await bob.request('/api/v1/accounts/account-c/overview')).status).toBe(403)
	} finally {
		await bank.destroy()
	}
})

test('a successful outer guard cannot bypass a denied downstream command', async () => {
	class RevokeAfterFirstRead extends AccountAccess {
		checks = 0
		override assertAllowed(identity: Identity, accountId: TransactionInput['accountId'], action: AccountAction) {
			this.checks++
			super.assertAllowed(identity, accountId, action)
			if (this.checks === 1) this.revoke(identity, accountId, action)
		}
	}
	const access = new RevokeAfterFirstRead()
	const bank = await createTestBank({ access })
	try {
		const bob = await bank.login('bob')
		const response = await bob.request('/api/v1/accounts/account-a/overview')
		expect(response.status).toBe(403)
		expect(access.checks).toBe(2)
		expect(await response.text()).not.toContain('transactionCount')
	} finally {
		await bank.destroy()
	}
})
