import { randomUUID } from 'node:crypto'
import { type FixtureActor, fixtureIdentities, type Identity } from './identity.js'

export const sessionCookieName = 'example_bank_session'
export const sessionLifetimeSeconds = 3600

/** A local teaching fixture, not a password or identity-provider implementation. */
export class LocalSessions {
	private readonly sessions = new Map<string, { identity: Identity; expiresAt: number }>()

	constructor(private readonly now: () => number = Date.now) {}

	create(actor: FixtureActor): string {
		const sessionId = randomUUID()
		this.sessions.set(sessionId, {
			identity: { ...fixtureIdentities[actor] },
			expiresAt: this.now() + sessionLifetimeSeconds * 1000,
		})
		return sessionId
	}

	find(cookieHeader: string | undefined): Identity | undefined {
		const sessionId = this.readId(cookieHeader)
		const session = sessionId ? this.sessions.get(sessionId) : undefined
		if (!sessionId || !session) return undefined
		if (session.expiresAt <= this.now()) {
			this.sessions.delete(sessionId)
			return undefined
		}
		return { ...session.identity }
	}

	delete(cookieHeader: string | undefined): void {
		const sessionId = this.readId(cookieHeader)
		if (sessionId) this.sessions.delete(sessionId)
	}

	private readId(cookieHeader: string | undefined): string | undefined {
		return cookieHeader
			?.split(';')
			.map(part => part.trim())
			.find(part => part.startsWith(sessionCookieName + '='))
			?.slice(sessionCookieName.length + 1)
	}
}
