import { expect, test } from 'vitest'
import { fixtureIdentities } from './identity.js'
import { createTestBank } from './testing/createTestBank.js'

const transaction = {
	accountId: 'account-a',
	sourceTransactionId: 'source-001',
	bookedAt: '2026-01-20T10:00:00.000Z',
	amountMinor: 1250,
	currency: 'EUR',
	direction: 'debit',
}

test('valid callers have different account and action permissions', async () => {
	const bank = await createTestBank()
	try {
		const alice = await bank.login('alice')
		const bob = await bank.login('bob')
		const dana = await bank.login('dana')
		const postOptions = {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ ...transaction, principalId: 'dana', tenantId: 'tenant-south' }),
		}
		expect((await bob.request('/api/v1/accounts/account-a/transactions')).status).toBe(200)
		expect((await bob.request('/api/v1/accounts/account-c/transactions')).status).toBe(403)
		expect((await bob.request('/api/v1/transactions', postOptions)).status).toBe(403)
		expect((await alice.request('/api/v1/transactions', postOptions)).status).toBe(403)
		const unchanged = await dana.request('/api/v1/accounts/account-a/transactions')
		expect(await unchanged.json()).toMatchObject({ transactions: [] })
		const saved = await dana.request('/api/v1/transactions', postOptions)
		expect(saved.status).toBe(200)
		expect(await saved.json()).toMatchObject({ tenantId: 'tenant-north' })

		bank.access.revoke(fixtureIdentities.bob, 'account-a', 'read')
		expect((await bob.request('/api/v1/accounts/account-a/transactions')).status).toBe(403)
		bank.access.freeze('tenant-north', 'account-a')
		expect(
			(
				await dana.request('/api/v1/transactions', {
					...postOptions,
					body: JSON.stringify({ ...transaction, sourceTransactionId: 'source-002' }),
				})
			).status,
		).toBe(403)
		const history = await dana.request('/api/v1/accounts/account-a/transactions')
		expect((await history.json()).transactions).toHaveLength(1)
	} finally {
		await bank.destroy()
	}
})

test('the same account, principal and source identifiers remain isolated by tenant', async () => {
	const bank = await createTestBank()
	try {
		const north = await bank.login('dana')
		const south = await bank.login('danaSouth')
		const post = (client: typeof north, amountMinor: number) =>
			client.request('/api/v1/transactions', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ ...transaction, amountMinor }),
			})
		expect((await post(north, 1250)).status).toBe(200)
		expect((await post(south, 9900)).status).toBe(200)
		const northRows = await (await north.request('/api/v1/accounts/account-a/transactions')).json()
		const southRows = await (await south.request('/api/v1/accounts/account-a/transactions')).json()
		expect(northRows.transactions).toHaveLength(1)
		expect(southRows.transactions).toHaveLength(1)
		expect(northRows.transactions[0]).toMatchObject({ tenantId: 'tenant-north', amountMinor: 1250 })
		expect(southRows.transactions[0]).toMatchObject({ tenantId: 'tenant-south', amountMinor: 9900 })
	} finally {
		await bank.destroy()
	}
})
