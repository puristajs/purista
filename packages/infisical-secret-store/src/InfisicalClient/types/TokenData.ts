import type { Scope } from './Scope.js'

/**
 * Service token metadata returned by Infisical.
 *
 * This includes account identifiers and encrypted project-key material. Treat the
 * whole object as sensitive and avoid logging it.
 */
export type TokenData = {
	/** Infisical token identifier. */
	_id: string
	/** Human-readable token name. */
	name: string
	/** Workspace identifier associated with the token. */
	workspace: string
	/** Environments and paths this token may access. */
	scopes: Scope[]
	/** User metadata associated with the token. */
	user: {
		/** Infisical user identifier. */
		_id: string
		/** Authentication methods configured for the user. */
		authMethods: string[]
		/** User email address returned by Infisical. */
		email: string
		/** User first name returned by Infisical. */
		firstName: string
		/** User last name returned by Infisical. */
		lastName: string
	}
	/** Service account identifier associated with the token. */
	serviceAccount: string
	/** Last usage time returned by Infisical. */
	lastUsed: Date
	/** Token expiry time returned by Infisical. */
	expiresAt: Date
	/** Encrypted project key. */
	encryptedKey: string
	/** Initialization vector for the encrypted project key. */
	iv: string
	/** Authentication tag for the encrypted project key. */
	tag: string
	/** ISO timestamp when the token was created. */
	createdAt: string
	/** ISO timestamp when the token was last updated. */
	updatedAt: string
	/** Permission identifiers returned by Infisical. */
	permissions: string[]
}
