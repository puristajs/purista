import { HandledError, StatusCode } from '@purista/core'
import type { KnowledgeCollectionPolicy } from './KnowledgeResources.js'

export async function requireKnowledgeCollectionAccess(
	policy: KnowledgeCollectionPolicy,
	input: Readonly<{ tenantId?: string; principalId?: string; collectionId: string }>,
) {
	if (!input.tenantId || !input.principalId) {
		throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
	}
	if (
		!(await policy.canSearch({
			tenantId: input.tenantId,
			principalId: input.principalId,
			collectionId: input.collectionId,
		}))
	) {
		throw new HandledError(StatusCode.Forbidden, 'This knowledge collection is not available')
	}
}
