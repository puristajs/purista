import { createCommandContextMock, getCommandMessageMock } from '@purista/core'
import { describe, expect, it, vi } from 'vitest'
import { ingestKnowledgeWorkflow } from '../../harness/workflow/ingestKnowledge/ingestKnowledgeWorkflow.js'
import { runIngestKnowledgeCommandBuilder } from './runIngestKnowledgeCommandBuilder.js'

const payload = {
	collectionId: 'customer-help',
	documentId: 'doc-1',
	revision: 1,
	title: 'Policy',
	content: 'one two three',
}

describe('runIngestKnowledgeCommandBuilder', () => {
	it('authorizes and invokes the mounted workflow', async () => {
		const policy = { canAccess: vi.fn().mockResolvedValue(true) }
		const { context, stubs } = createCommandContextMock(runIngestKnowledgeCommandBuilder, {
			payload,
			parameter: {},
			resources: { knowledgeCollectionPolicy: policy },
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			payload: { payload, parameter: {} },
		})
		const output = { documentId: 'doc-1', revision: 1, chunkCount: 1, embeddingModel: 'fake-embedding' }
		stubs.workflow.Knowledge['1'][ingestKnowledgeWorkflow.contract.id].run.resolves({
			sessionId: 'knowledge-session',
			outcome: { status: 'completed', runId: 'run-1', output },
		})

		await expect(
			runIngestKnowledgeCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).resolves.toEqual(output)
		expect(policy.canAccess).toHaveBeenCalledWith({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			collectionId: 'customer-help',
			action: 'edit',
		})
		expect(stubs.workflow.Knowledge['1'][ingestKnowledgeWorkflow.contract.id].run.calledOnce).toBe(true)
		expect(stubs.workflow.Knowledge['1'][ingestKnowledgeWorkflow.contract.id].run.firstCall.args[1]).toEqual({
			sessionId: expect.stringMatching(/^knowledge:[a-f0-9]{64}$/),
		})
	})

	it('denies before invoking the workflow', async () => {
		const policy = { canAccess: vi.fn().mockResolvedValue(false) }
		const { context, stubs } = createCommandContextMock(runIngestKnowledgeCommandBuilder, {
			payload,
			parameter: {},
			resources: { knowledgeCollectionPolicy: policy },
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			payload: { payload, parameter: {} },
		})

		await expect(
			runIngestKnowledgeCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).rejects.toMatchObject({ errorCode: 403 })
		expect(stubs.workflow.Knowledge['1'][ingestKnowledgeWorkflow.contract.id].run.called).toBe(false)
	})
})
