import type { Scope } from './Scope.js'

export type TokenData = {
	_id: string
	name: string
	workspace: string
	scopes: Scope[]
	user: {
		_id: string
		authMethods: string[]
		email: string
		firstName: string
		lastName: string
	}
	serviceAccount: string
	lastUsed: Date
	expiresAt: Date
	encryptedKey: string
	iv: string
	tag: string
	createdAt: string
	updatedAt: string
	permissions: string[]
}
