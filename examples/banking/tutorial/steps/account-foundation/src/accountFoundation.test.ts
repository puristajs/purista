import { expect, test } from 'vitest'
import { AccountAccess } from './accountAccess.js'
import { fixtureIdentities } from './identity.js'
import { LocalSessions, sessionCookieName, sessionLifetimeSeconds } from './localSessions.js'

test('a session stores server identity and expires even if its cookie is kept', () => {
	let now = 0
	const sessions = new LocalSessions(() => now)
	const cookie = `${sessionCookieName}=${sessions.create('bob')}`
	expect(sessions.find(cookie)).toEqual(fixtureIdentities.bob)
	now = sessionLifetimeSeconds * 1000
	expect(sessions.find(cookie)).toBeUndefined()
	const renewedCookie = `${sessionCookieName}=${sessions.create('bob')}`
	sessions.delete(renewedCookie)
	expect(sessions.find(renewedCookie)).toBeUndefined()
})

test('identity stays the same when an account permission changes', () => {
	const access = new AccountAccess()
	expect(() => access.assertAllowed(fixtureIdentities.bob, 'account-a', 'read')).not.toThrow()
	expect(() => access.assertAllowed(fixtureIdentities.bob, 'account-a', 'record')).toThrow()
	access.revoke(fixtureIdentities.bob, 'account-a', 'read')
	expect(() => access.assertAllowed(fixtureIdentities.bob, 'account-a', 'read')).toThrow()
})
