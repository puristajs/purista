import { HandledError, StatusCode } from '@purista/core'

/** Trusted caller metadata established by the server, never by a request body. */
export type Identity = { tenantId: string; principalId: string }

export const fixtureIdentities = {
	alice: { tenantId: 'tenant-north', principalId: 'alice' },
	bob: { tenantId: 'tenant-north', principalId: 'bob' },
	carol: { tenantId: 'tenant-north', principalId: 'carol' },
	dana: { tenantId: 'tenant-north', principalId: 'dana' },
	danaSouth: { tenantId: 'tenant-south', principalId: 'dana' },
} as const satisfies Record<string, Identity>

export type FixtureActor = keyof typeof fixtureIdentities

export function isFixtureActor(value: unknown): value is FixtureActor {
	return typeof value === 'string' && Object.hasOwn(fixtureIdentities, value)
}

/** Require metadata even when a caller reaches the command without HTTP. */
export function requireIdentity(message: { tenantId?: string; principalId?: string }): Identity {
	if (!message.tenantId || !message.principalId) {
		throw new HandledError(StatusCode.Unauthorized, 'Caller identity is required')
	}
	return { tenantId: message.tenantId, principalId: message.principalId }
}
