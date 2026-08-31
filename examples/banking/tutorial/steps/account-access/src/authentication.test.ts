import { expect, test } from 'vitest'
import { LocalSessions, sessionLifetimeSeconds } from './localSessions.js'
import { createTestBank } from './testing/createTestBank.js'

test('protected routes require a live server session, not identity headers', async () => {
	let now = 0
	const bank = await createTestBank({ sessions: new LocalSessions(() => now) })
	try {
		const path = '/api/v1/accounts/account-a/transactions'
		expect((await bank.request('/api/v1/bank')).status).toBe(200)
		expect((await bank.request(path)).status).toBe(401)
		expect(
			(
				await bank.request(path, {
					headers: {
						'x-principal-id': 'dana',
						'x-tenant-id': 'tenant-north',
					},
				})
			).status,
		).toBe(401)
		const bob = await bank.login('bob')
		expect((await bob.request(path)).status).toBe(200)
		now = sessionLifetimeSeconds * 1000
		expect((await bob.request(path)).status).toBe(401)
		const renewed = await bank.login('bob')
		expect((await renewed.request('/auth/logout', { method: 'POST' })).status).toBe(200)
		// Reuse the old cookie deliberately: deleting it on the server must be enough.
		expect((await renewed.request(path)).status).toBe(401)
	} finally {
		await bank.destroy()
	}
})

test('fixture login rejects unknown actors and cross-site requests', async () => {
	const bank = await createTestBank()
	try {
		const login = (actor: string, origin?: string) =>
			bank.request('/auth/login', {
				method: 'POST',
				headers: { 'content-type': 'application/json', ...(origin ? { origin } : {}) },
				body: JSON.stringify({ actor }),
			})
		expect((await login('unknown')).status).toBe(400)
		expect((await login('dana', 'https://unrelated.example')).status).toBe(403)
		const response = await login('bob')
		expect(response.headers.get('set-cookie')).toContain('HttpOnly')
		expect(response.headers.get('set-cookie')).toContain('SameSite=Strict')
	} finally {
		await bank.destroy()
	}
})
