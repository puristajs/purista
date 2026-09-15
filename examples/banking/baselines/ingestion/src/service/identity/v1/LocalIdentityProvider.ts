export type LocalIdentity = {
	principalId: string
	tenantId: string
	displayName: string
}

export interface LocalIdentityProvider {
	authenticate(username: string, password: string): Promise<LocalIdentity | undefined>
}

export const localIdentityProvider: LocalIdentityProvider = {
	async authenticate(username, password) {
		if (username !== 'alex@example.test' || password !== 'demo-password') return undefined
		return {
			principalId: 'principal-alex',
			tenantId: 'tenant-example',
			displayName: 'Alex Example',
		}
	},
}
