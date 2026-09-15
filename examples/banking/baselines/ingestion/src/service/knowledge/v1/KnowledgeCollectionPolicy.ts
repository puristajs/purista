export type KnowledgeCollectionAccess = {
	tenantId?: string
	principalId?: string
	collectionId: string
	action: 'edit'
}

export interface KnowledgeCollectionPolicy {
	isAllowed(access: KnowledgeCollectionAccess): boolean
}

export const localKnowledgeCollectionPolicy: KnowledgeCollectionPolicy = {
	isAllowed({ tenantId, principalId, collectionId }) {
		return tenantId === 'tenant-example'
			&& principalId === 'principal-alex'
			&& collectionId === 'policy-help'
	},
}
