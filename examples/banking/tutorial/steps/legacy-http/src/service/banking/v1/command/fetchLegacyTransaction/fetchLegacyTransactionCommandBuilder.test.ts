import type { AddressInfo } from 'node:net'
import { expect, test } from 'vitest'
import { LegacyBankHttpClient } from '../../../../../legacyBank.js'
import { createLegacyBankMock } from '../../../../../mockLegacyBank.js'
import { createTestBank } from '../../../../../testing/createTestBank.js'

test('the HTTP dependency respects tenant scope, failures and permission before fetching', async () => {
	const mock = createLegacyBankMock()
	await new Promise<void>((resolve, reject) => {
		mock.server.once('error', reject)
		mock.server.listen(0, '127.0.0.1', resolve)
	})
	const baseUrl = 'http://127.0.0.1:' + (mock.server.address() as AddressInfo).port
	const legacyBank = new LegacyBankHttpClient(baseUrl, 250)
	const bank = await createTestBank({ legacyBank })
	try {
		const bob = await bank.login('bob')
		const dana = await bank.login('dana')
		const south = await bank.login('danaSouth')
		const post = { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }
		const path = (sourceId: string) => '/api/v1/accounts/account-a/legacy-imports/' + sourceId
		expect((await bob.request(path('legacy-001'), post)).status).toBe(403)
		expect(mock.requests).toEqual([])
		const northResult = await dana.request(path('legacy-001'), post)
		expect(northResult.status).toBe(200)
		expect(await northResult.json()).toMatchObject({ tenantId: 'tenant-north', amountMinor: 12540 })
		const southResult = await south.request(path('legacy-001'), post)
		expect(southResult.status).toBe(200)
		expect(await southResult.json()).toMatchObject({ tenantId: 'tenant-south', amountMinor: 9900 })
		expect(mock.requests.map(request => [request.tenantId, request.principalId])).toEqual([
			['tenant-north', 'dana'],
			['tenant-south', 'dana'],
		])
		expect((await dana.request(path('legacy-001'), post)).status).toBe(409)
		for (const [sourceId, status] of [
			['missing', 404],
			['malformed', 502],
			['wrong-account', 502],
			['wrong-id', 502],
			['oversized', 502],
			['slow', 504],
		] as const) {
			const response = await dana.request(path(sourceId), post)
			expect(response.status, sourceId).toBe(status)
			expect(await response.text()).not.toContain('mock-north')
		}
		const history = await dana.request('/api/v1/accounts/account-a/transactions')
		expect((await history.json()).transactions).toHaveLength(1)
	} finally {
		await bank.destroy()
		mock.server.closeAllConnections()
		await new Promise<void>((resolve, reject) => mock.server.close(error => (error ? reject(error) : resolve())))
	}
})
