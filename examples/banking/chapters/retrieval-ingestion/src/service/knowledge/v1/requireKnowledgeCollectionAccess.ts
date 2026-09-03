import { HandledError, StatusCode } from '@purista/core'
import type { KnowledgeCollectionPolicy } from './KnowledgeResources.js'

export async function requireKnowledgeCollectionAccess(
	policy: KnowledgeCollectionPolicy,
	input: Readonly<{
		tenantId?: string
		principalId?: string
		collectionId: string
		action: 'edit' | 'search'
	}>,
) {
	if (!input.tenantId || !input.principalId) {
		throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
	}
	if (
		!(await policy.canAccess({
			tenantId: input.tenantId,
			principalId: input.principalId,
			collectionId: input.collectionId,
			action: input.action,
		}))
	) {
		throw new HandledError(StatusCode.Forbidden, 'This knowledge collection is not available')
	}
}
