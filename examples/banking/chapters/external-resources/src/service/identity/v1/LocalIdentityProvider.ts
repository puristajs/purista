export type LocalIdentity = {
	principalId: string
	tenantId: string
	displayName: string
}

export interface LocalIdentityProvider {
	authenticate(username: string, password: string): Promise<LocalIdentity | undefined>
}

const identities: Readonly<Record<string, LocalIdentity>> = {
	'alex@example.test': {
		principalId: 'principal-alex',
		tenantId: 'tenant-example',
		displayName: 'Alex Example',
	},
	'sam@example.test': {
		principalId: 'principal-sam',
		tenantId: 'tenant-example',
		displayName: 'Sam Example',
	},
}

export const localIdentityProvider: LocalIdentityProvider = {
	async authenticate(username, password) {
		if (password !== 'demo-password') return undefined
		return identities[username]
	},
}
