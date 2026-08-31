import { DefaultEventBridge, DefaultQueueBridge } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { afterEach, describe, expect, it } from 'vitest'

import { BankingKnowledgeRepository } from './repository.js'
import { bankingKnowledgeService, embedDocumentAgentBuilder } from './service.js'

type StartedKnowledgeApplication = {
	fetch: (request: Request) => Promise<Response>
	repository: BankingKnowledgeRepository
	destroy: () => Promise<void>
}

let destroy: (() => Promise<void>) | undefined

afterEach(async () => {
	await destroy?.()
	destroy = undefined
})

const waitFor = async (predicate: () => boolean | Promise<boolean>, timeoutMs = 1_500) => {
	const deadline = Date.now() + timeoutMs
	while (Date.now() < deadline) {
		if (await predicate()) return
		await new Promise(resolve => setTimeout(resolve, 20))
	}
	throw new Error(`Timed out after ${timeoutMs}ms`)
}

const start = async (principalId: string, tenantId = 'tenant-north'): Promise<StartedKnowledgeApplication> => {
	const eventBridge = new DefaultEventBridge()
	const queueBridge = new DefaultQueueBridge()
	const repository = new BankingKnowledgeRepository()
	await eventBridge.start()
	await queueBridge.start()
	const service = await bankingKnowledgeService.getInstance(eventBridge, {
		queueBridge,
		resources: { knowledgeRepository: repository },
		// PURISTA initializes all attached agents through the service AI runtime.
		// This agent declares no models, so this is intentionally an empty binding.
		ai: { models: {} },
	})
	await service.start()
	const hono = await honoV1Service.getInstance(eventBridge, {
		serviceConfig: { services: [service], autoRegisterServicesFromConfig: true },
	})
	hono.setProtectMiddleware(async (context, next) => {
		context.set('principalId', principalId)
		context.set('tenantId', tenantId)
		return next()
	})
	await hono.start()
	destroy = async () => {
		await hono.destroy()
		await service.destroy()
		await queueBridge.destroy()
		await eventBridge.destroy()
	}
	return { fetch: async request => hono.app.fetch(request), repository, destroy }
}

const ingest = (application: StartedKnowledgeApplication, input: Record<string, unknown>) =>
	application.fetch(
		new Request('http://example.test/api/v1/knowledge/documents', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(input),
		}),
	)

describe('banking knowledge document ingestion', () => {
	it('declares a service-attached agent queue without a live model provider', async () => {
		const definition = await embedDocumentAgentBuilder.getDefinition()
		const definitions = await bankingKnowledgeService.resolveDefinitions()

		expect(definition.manifest.models).toEqual({})
		expect(definitions.queues.map(queue => queue.queueName)).toContain('agent:bankingKnowledge:1:embedDocument')
		expect(definitions.queueWorkers.map(worker => worker.queueName)).toContain('agent:bankingKnowledge:1:embedDocument')
		expect(definitions.commands.map(command => command.commandName)).toContain('requestDocumentIngestion')
	})

	it('ingests and searches an authorized account collection through HTTP, queue, worker, and attached run function', async () => {
		const application = await start('alice')
		const response = await ingest(application, {
			collectionId: 'account-a-documents',
			documentId: 'statement-guide',
			title: 'Statement guide',
			text: 'Monthly statements explain booked transactions and balances. Contact support for an account question.',
			revision: 1,
		})
		expect(response.status).toBe(200)
		expect(await response.json()).toMatchObject({ queueName: 'agent:bankingKnowledge:1:embedDocument' })

		await waitFor(() => application.repository.getDocument('account-a-documents', 'statement-guide') !== undefined)
		expect(application.repository.listEmbeddingRequests()).toEqual([
			{ collectionId: 'account-a-documents', documentId: 'statement-guide', revision: 1 },
		])

		const search = await application.fetch(
			new Request('http://example.test/api/v1/knowledge/search', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ collectionId: 'account-a-documents', query: 'booked balances' }),
			}),
		)
		expect(search.status).toBe(200)
		expect(await search.json()).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ documentId: 'statement-guide', revision: 1, title: 'Statement guide' }),
			]),
		)
	})

	it('rejects cross-account and cross-tenant ingestion before it can reach embedding or storage', async () => {
		const crossAccount = await start('bob')
		const deniedAccount = await ingest(crossAccount, {
			collectionId: 'account-c-documents',
			documentId: 'secret-c',
			title: 'Secret C',
			text: 'Confidential account-c content must never reach the embedding run function.',
			revision: 1,
		})
		expect(deniedAccount.status).toBe(403)
		expect(crossAccount.repository.listEmbeddingRequests()).toEqual([])
		expect(crossAccount.repository.listDocuments('account-c-documents')).toEqual([])
		await crossAccount.destroy()
		destroy = undefined

		const crossTenant = await start('alice', 'tenant-south')
		const deniedTenant = await ingest(crossTenant, {
			collectionId: 'account-a-documents',
			documentId: 'secret-tenant',
			title: 'Secret tenant',
			text: 'Cross tenant content must never reach the embedding run function.',
			revision: 1,
		})
		expect(deniedTenant.status).toBe(403)
		expect(crossTenant.repository.listEmbeddingRequests()).toEqual([])
		expect(crossTenant.repository.listDocuments('account-a-documents')).toEqual([])
	})

	it('keeps duplicate deliveries idempotent, updates revisions, deletes documents, and records worker failures', async () => {
		const application = await start('alice')
		const initial = {
			collectionId: 'account-a-documents',
			documentId: 'fees',
			title: 'Fee guide',
			text: 'The account fee is shown on your monthly statement.',
			revision: 1,
		}
		expect((await ingest(application, initial)).status).toBe(200)
		await waitFor(() => application.repository.getDocument('account-a-documents', 'fees')?.revision === 1)

		expect((await ingest(application, initial)).status).toBe(200)
		await waitFor(() => application.repository.listEmbeddingRequests().length === 2)
		expect(application.repository.listDocuments('account-a-documents')).toHaveLength(1)

		expect(
			(
				await ingest(application, {
					...initial,
					text: 'The updated account fee guide explains statement charges and yearly pricing.',
					revision: 2,
				})
			).status,
		).toBe(200)
		await waitFor(() => application.repository.getDocument('account-a-documents', 'fees')?.revision === 2)

		const deleted = await application.fetch(
			new Request('http://example.test/api/v1/knowledge/collections/account-a-documents/documents/fees', {
				method: 'DELETE',
			}),
		)
		expect(deleted.status).toBe(200)
		expect(await deleted.json()).toEqual({ deleted: true })
		expect(application.repository.listDocuments('account-a-documents')).toEqual([])

		expect(
			(
				await ingest(application, {
					...initial,
					documentId: 'failed-document',
					text: '[[force-embedding-failure]]',
					revision: 1,
				})
			).status,
		).toBe(200)
		await waitFor(() => application.repository.listFailures().length === 1)
		expect(application.repository.getDocument('account-a-documents', 'failed-document')).toBeUndefined()
		expect(application.repository.listFailures()[0]).toMatchObject({ documentId: 'failed-document', revision: 1 })
	})
})
