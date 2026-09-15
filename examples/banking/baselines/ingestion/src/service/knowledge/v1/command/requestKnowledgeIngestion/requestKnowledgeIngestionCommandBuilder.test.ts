import {
	createCommandContextMock,
	getCommandMessageMock,
	getEventBridgeMock,
	getLoggerMock,
	safeBind,
} from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, test } from 'vitest'
import { localKnowledgeCollectionPolicy } from '../../KnowledgeCollectionPolicy.js'
import { demoEmbeddingModel } from '../../KnowledgeResources.js'
import { knowledgeV1ServiceBuilder } from '../../knowledgeV1ServiceBuilder.js'
import { requestKnowledgeIngestionCommandBuilder } from './requestKnowledgeIngestionCommandBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

const payload = {
	documentId: 'card-help',
	revision: 1,
	title: 'Card help',
	content: 'Lock a lost card in the app. Contact support for a replacement.',
	embeddingModel: demoEmbeddingModel,
} as const
const parameter = { collectionId: 'policy-help' }
async function fixture(principalId: string) {
	const resources = {
		knowledgeCollectionPolicy: localKnowledgeCollectionPolicy,
		knowledgeEmbeddingProvider: { embed: sandbox.stub() },
		knowledgeRepository: {
			replaceRevision: sandbox.stub(),
			withdrawRevision: sandbox.stub(),
			search: sandbox.stub(),
		},
	}
	const service = await knowledgeV1ServiceBuilder.getInstance(getEventBridgeMock(sandbox).mock, {
		logger: getLoggerMock(sandbox).mock,
		resources,
	})
	const mocked = createCommandContextMock(requestKnowledgeIngestionCommandBuilder, {
		payload,
		parameter,
		resources,
		sandbox,
	})
	mocked.context.message = getCommandMessageMock({
		tenantId: 'tenant-example',
		principalId,
		payload: { payload, parameter },
	})
	return {
		service,
		mocked,
		guard: safeBind(requestKnowledgeIngestionCommandBuilder.getBeforeGuardHook('mayEditCollection'), service),
		command: safeBind(requestKnowledgeIngestionCommandBuilder.getCommandFunction(), service),
	}
}

describe('requestKnowledgeIngestion command', () => {
	test('enqueues trusted scope and one stable revision key', async () => {
		const { service, mocked, guard, command } = await fixture('principal-alex')
		mocked.stubs.enqueue.resolves({ jobId: 'job-1', queueName: 'ingestKnowledge' })
		try {
			await guard(mocked.context, payload, parameter)
			await expect(command(mocked.context, payload, parameter)).resolves.toEqual({
				jobId: 'job-1',
				queueName: 'ingestKnowledge',
			})
			expect(mocked.stubs.enqueue.calledOnceWith(
				'ingestKnowledge',
				{ ...payload, collectionId: 'policy-help' },
				{},
				sandbox.match({
					idempotencyKey: 'tenant-example:policy-help:card-help:1',
					headers: {
						'purista.tenantId': 'tenant-example',
						'purista.principalId': 'principal-alex',
					},
				}),
			)).toBe(true)
		} finally {
			await service.destroy()
		}
	})

	test('denies another valid principal before enqueue', async () => {
		const { service, mocked, guard } = await fixture('principal-sam')
		try {
			await expect(guard(mocked.context, payload, parameter))
				.rejects.toThrow('Collection action is not allowed')
			expect(mocked.stubs.enqueue.called).toBe(false)
		} finally {
			await service.destroy()
		}
	})
})
