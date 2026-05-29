/**
 * Encrypted secret payload returned by the Infisical API.
 *
 * This DTO contains ciphertext and metadata only, but it can still reveal
 * workspace, environment, and naming information. Avoid logging it in shared
 * environments.
 */
export type Secret = {
	/** Infisical secret identifier. */
	_id: string
	/** Secret version number. */
	version: number
	/** Workspace identifier that owns the secret. */
	workspace: string
	/** User identifier when Infisical associates the secret with a user. */
	user?: string
	/** Infisical secret type. PURISTA writes shared secrets. */
	type: 'shared' | 'personal'
	/** Environment that contains the secret. */
	environment: string
	/** Encrypted secret name. */
	secretKeyCiphertext: string
	/** Initialization vector for the encrypted secret name. */
	secretKeyIV: string
	/** Authentication tag for the encrypted secret name. */
	secretKeyTag: string
	/** Encrypted secret value. */
	secretValueCiphertext: string
	/** Initialization vector for the encrypted secret value. */
	secretValueIV: string
	/** Authentication tag for the encrypted secret value. */
	secretValueTag: string
	/** Optional encrypted comment. */
	secretCommentCiphertext?: string
	/** Initialization vector for the optional encrypted comment. */
	secretCommentIV?: string
	/** Authentication tag for the optional encrypted comment. */
	secretCommentTag?: string
	/** ISO timestamp when the secret was created. */
	createdAt: string
	/** ISO timestamp when the secret was last updated. */
	updatedAt: string
}
