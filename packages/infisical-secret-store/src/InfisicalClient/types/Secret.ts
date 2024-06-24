export type Secret = {
	_id: string
	version: number
	workspace: string
	user?: string
	type: 'shared' | 'personal'
	environment: string
	secretKeyCiphertext: string
	secretKeyIV: string
	secretKeyTag: string
	secretValueCiphertext: string
	secretValueIV: string
	secretValueTag: string
	secretCommentCiphertext?: string
	secretCommentIV?: string
	secretCommentTag?: string
	createdAt: string
	updatedAt: string
}
