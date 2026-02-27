import { describe, expect, it } from 'vitest'

import { InMemoryKnowledgeAdapter } from './adapters/inMemoryAdapter.js'

describe('InMemoryKnowledgeAdapter', () => {
	it('stores and queries documents', async () => {
		const adapter = new InMemoryKnowledgeAdapter()
		await adapter.upsert({ id: 'doc-1', content: 'Purista AI orchestration' })
		await adapter.upsert({ id: 'doc-2', content: 'Other content' })

		const results = await adapter.query('orchestration')
		expect(results).toHaveLength(1)
		expect(results[0]?.id).toBe('doc-1')
	})
})
