import { describe, expect, it, vi } from 'vitest'
import { retrieveKnowledgeWorkflow } from '../../workflow/retrieveKnowledge/retrieveKnowledgeWorkflow.js'
import { searchKnowledgeTool } from './searchKnowledgeTool.js'

const input = { collectionId: 'customer-help', query: 'How long are transfers pending?', limit: 4 }

describe('searchKnowledgeTool', () => {
	it('authorizes the actual collection then invokes retrieval address-first', async () => {
		const canAccess = vi.fn().mockResolvedValue(true)
		const run = vi.fn().mockResolvedValue({ matches: [] })
		await expect(
			searchKnowledgeTool.handler(
				{
					identity: { tenantId: 'tenant-example', principalId: 'principal-alex' },
					resources: { knowledgeCollectionPolicy: { canAccess } },
					workflow: { Knowledge: { '1': { [retrieveKnowledgeWorkflow.contract.id]: { run } } } },
				} as never,
				input,
			),
		).resolves.toEqual({ matches: [] })
		expect(canAccess).toHaveBeenCalledWith({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			collectionId: input.collectionId,
			action: 'search',
		})
		expect(run).toHaveBeenCalledWith(input, { callId: 'retrieve-knowledge' })
	})

	it('denies before invoking the nested workflow', async () => {
		const run = vi.fn()
		await expect(
			searchKnowledgeTool.handler(
				{
					identity: { tenantId: 'tenant-example', principalId: 'principal-denied' },
					resources: { knowledgeCollectionPolicy: { canAccess: vi.fn().mockResolvedValue(false) } },
					workflow: { Knowledge: { '1': { [retrieveKnowledgeWorkflow.contract.id]: { run } } } },
				} as never,
				input,
			),
		).rejects.toMatchObject({ errorCode: 403 })
		expect(run).not.toHaveBeenCalled()
	})
})
