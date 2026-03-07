/**
 * Minimal document structure understood by knowledge adapters.
 */
export type KnowledgeDocument = {
	id: string
	content: string
	metadata?: Record<string, unknown>
}

/**
 * Tenant/user/agent scope metadata propagated from the Purista message.
 * Adapters can use this to isolate retrieval data in multi-tenant setups.
 */
export type KnowledgeScope = {
	tenantId?: string
	principalId?: string
	agentName?: string
	agentVersion?: string
	sessionId?: string
}

/**
 * Input for adapter query operations.
 */
export type KnowledgeQueryRequest = {
	query: string
	limit?: number
	filters?: Record<string, unknown>
	scope?: KnowledgeScope
	options?: Record<string, unknown>
}

/**
 * Input for adapter upsert operations.
 */
export type KnowledgeUpsertRequest = {
	document: KnowledgeDocument
	scope?: KnowledgeScope
	options?: Record<string, unknown>
}

/**
 * Input for adapter delete operations.
 */
export type KnowledgeDeleteRequest = {
	id: string
	scope?: KnowledgeScope
	options?: Record<string, unknown>
}

export interface KnowledgeAdapter {
	/**
	 * Stable identifier used in logs/telemetry.
	 */
	id: string
	/**
	 * Insert or update one document.
	 */
	upsert(request: KnowledgeUpsertRequest): Promise<void>
	/**
	 * Search documents for a natural-language query.
	 */
	query(request: KnowledgeQueryRequest): Promise<KnowledgeDocument[]>
	/**
	 * Remove one document by id.
	 */
	delete(request: KnowledgeDeleteRequest): Promise<void>
}

/**
 * Reference knowledge adapter that keeps documents in memory.
 * Useful for tests and local development.
 */
export class InMemoryKnowledgeAdapter implements KnowledgeAdapter {
	readonly id = 'in-memory-knowledge'
	private readonly documents = new Map<string, { document: KnowledgeDocument; scopeKey?: string }>()

	private getScopeKey(scope?: KnowledgeScope) {
		if (!scope?.tenantId && !scope?.principalId && !scope?.agentName && !scope?.agentVersion) {
			return undefined
		}
		return [scope.tenantId ?? '', scope.principalId ?? '', scope.agentName ?? '', scope.agentVersion ?? ''].join(':')
	}

	async upsert(request: KnowledgeUpsertRequest) {
		const scopeKey = this.getScopeKey(request.scope)
		const key = `${scopeKey ?? 'global'}::${request.document.id}`
		this.documents.set(key, { document: request.document, scopeKey })
	}

	async query(request: KnowledgeQueryRequest) {
		const scopeKey = this.getScopeKey(request.scope)
		const limit = request.limit ?? 5
		const results = Array.from(this.documents.values())
			.filter(entry => {
				const isVisible = entry.scopeKey === undefined || entry.scopeKey === scopeKey
				return isVisible && entry.document.content.toLowerCase().includes(request.query.toLowerCase())
			})
			.map(entry => entry.document)
		return results.slice(0, limit)
	}

	async delete(request: KnowledgeDeleteRequest) {
		const scopeKey = this.getScopeKey(request.scope)
		if (scopeKey) {
			this.documents.delete(`${scopeKey}::${request.id}`)
			return
		}
		for (const key of this.documents.keys()) {
			if (key.endsWith(`::${request.id}`)) {
				this.documents.delete(key)
			}
		}
	}
}
