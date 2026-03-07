import { describe, expect, it } from 'vitest'

import { InMemoryKnowledgeAdapter } from './adapters/inMemoryAdapter.js'

describe('InMemoryKnowledgeAdapter', () => {
	it('stores and queries documents', async () => {
		const adapter = new InMemoryKnowledgeAdapter()
		await adapter.upsert({ document: { id: 'doc-1', content: 'Purista AI orchestration' } })
		await adapter.upsert({ document: { id: 'doc-2', content: 'Other content' } })

		const results = await adapter.query({ query: 'orchestration' })
		expect(results).toHaveLength(1)
		expect(results[0]?.id).toBe('doc-1')
	})

	it('isolates scoped documents while keeping global documents visible', async () => {
		const adapter = new InMemoryKnowledgeAdapter()
		await adapter.upsert({ document: { id: 'global-1', content: 'Global onboarding FAQ' } })
		await adapter.upsert({
			document: { id: 'tenant-a', content: 'Tenant A billing policy' },
			scope: { tenantId: 'tenant-a', agentName: 'supportAgent', agentVersion: '1' },
		})

		const tenantAResults = await adapter.query({
			query: 'policy',
			scope: { tenantId: 'tenant-a', agentName: 'supportAgent', agentVersion: '1' },
		})
		expect(tenantAResults).toHaveLength(1)
		expect(tenantAResults[0]?.id).toBe('tenant-a')

		const tenantBResults = await adapter.query({
			query: 'policy',
			scope: { tenantId: 'tenant-b', agentName: 'supportAgent', agentVersion: '1' },
		})
		expect(tenantBResults).toHaveLength(0)
	})

	it('deletes scoped and global documents', async () => {
		const adapter = new InMemoryKnowledgeAdapter()
		await adapter.upsert({ document: { id: 'global-1', content: 'Global FAQ entry' } })
		await adapter.upsert({
			document: { id: 'tenant-1', content: 'Tenant specific entry' },
			scope: { tenantId: 'tenant-a', agentName: 'supportAgent', agentVersion: '1' },
		})

		await adapter.delete({
			id: 'tenant-1',
			scope: { tenantId: 'tenant-a', agentName: 'supportAgent', agentVersion: '1' },
		})
		const scopedResults = await adapter.query({
			query: 'Tenant',
			scope: { tenantId: 'tenant-a', agentName: 'supportAgent', agentVersion: '1' },
		})
		expect(scopedResults).toHaveLength(0)

		await adapter.delete({ id: 'global-1' })
		const globalResults = await adapter.query({ query: 'Global' })
		expect(globalResults).toHaveLength(0)
	})
})
