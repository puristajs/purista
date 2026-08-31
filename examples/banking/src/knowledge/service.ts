// biome-ignore-all lint/correctness/useHookAtTopLevel: PURISTA builder methods named useBuiltInTools are not React hooks.
import { HandledError, ServiceBuilder, type ServiceInfoType, StatusCode } from '@purista/core'
import { z } from 'zod'

import { type BankingKnowledgeRepository, type KnowledgeCollectionId, knowledgeCollectionIds } from './repository.js'

const collectionIdSchema = z.enum(knowledgeCollectionIds)
const documentIdSchema = z
	.string()
	.min(1)
	.max(80)
	.regex(/^[a-z0-9-]+$/)
const documentPayloadSchema = z.object({
	collectionId: collectionIdSchema,
	documentId: documentIdSchema,
	title: z.string().min(1).max(160),
	text: z.string().min(1).max(12_000),
	revision: z.number().int().positive(),
})
const embeddingParameterSchema = z.object({
	tenantId: z.literal('tenant-north'),
	/** Identity copied by the guarded command. It is never accepted from the HTTP request body. */
	initiatorPrincipalId: z.enum(['alice', 'bob', 'carol', 'dana', 'erin']),
})
const emptyParameterSchema = z.object({})
const queueName = 'agent:bankingKnowledge:1:embedDocument' as const
const exampleActors = ['alice', 'bob', 'carol', 'dana', 'erin'] as const

const isExampleActor = (value: unknown): value is (typeof exampleActors)[number] =>
	typeof value === 'string' && exampleActors.includes(value as (typeof exampleActors)[number])

const searchResultSchema = z.object({
	documentId: documentIdSchema,
	title: z.string(),
	revision: z.number().int().positive(),
	chunkId: z.string(),
	excerpt: z.string(),
	score: z.number(),
})

const serviceInfo = {
	serviceName: 'bankingKnowledge',
	serviceVersion: '1',
	serviceDescription: 'Ingests and searches authorized banking documents with a deterministic attached embedding agent',
} as const satisfies ServiceInfoType

const builder = new ServiceBuilder(serviceInfo).defineResource<'knowledgeRepository', BankingKnowledgeRepository>()

const requireCollectionAccess = (
	repository: BankingKnowledgeRepository,
	collectionId: KnowledgeCollectionId,
	identity: { tenantId: string | undefined; principalId: string | undefined },
) => {
	if (!repository.canAccessCollection({ ...identity, collectionId })) {
		throw new HandledError(StatusCode.Forbidden, 'You may not access this banking document collection')
	}
}

/**
 * The agent has no configured model. Its run function owns a deterministic
 * embedding step, while the service owns queue delivery, contracts, and P6
 * authorization. The command below performs the first scope check before the
 * document text enters this agent queue.
 */
export const embedDocumentAgentBuilder = builder
	.getAgentQueueBuilder('embedDocument', 'Creates deterministic vectors for one authorized banking document')
	.addPayloadSchema(documentPayloadSchema)
	.addParameterSchema(embeddingParameterSchema)
	.addOutputSchema(
		z.object({
			documentId: documentIdSchema,
			collectionId: collectionIdSchema,
			revision: z.number().int().positive(),
			outcome: z.enum(['created', 'updated', 'unchanged']),
		}),
	)
	.useBuiltInTools(false)
	.setExecutionPolicy({ maxAttempts: 1, maxParallelHandlers: 1 })
	.setRunFunction(async context => {
		// Queue work rechecks P6 using command-owned identity, so changed mandates
		// or direct queue deliveries cannot cause document storage or embedding.
		requireCollectionAccess(context.resources.knowledgeRepository, context.payload.collectionId, {
			tenantId: context.parameter.tenantId,
			principalId: context.parameter.initiatorPrincipalId,
		})
		try {
			const result = context.resources.knowledgeRepository.storeEmbeddedDocument(context.payload)
			return {
				documentId: result.document.documentId,
				collectionId: result.document.collectionId,
				revision: result.document.revision,
				outcome: result.outcome,
			}
		} catch (error) {
			context.resources.knowledgeRepository.recordFailure({
				collectionId: context.payload.collectionId,
				documentId: context.payload.documentId,
				revision: context.payload.revision,
				reason: error instanceof Error ? error.message : 'Unknown deterministic embedding failure',
			})
			throw error
		}
	})

const requestDocumentIngestion = builder
	.getCommandBuilder('requestDocumentIngestion', 'Queue an authorized banking document for deterministic ingestion')
	.addPayloadSchema(documentPayloadSchema)
	.addParameterSchema(emptyParameterSchema)
	.addOutputSchema(z.object({ jobId: z.string(), queueName: z.literal(queueName) }))
	.canEnqueue(queueName, documentPayloadSchema, embeddingParameterSchema)
	.exposeAsHttpEndpoint('POST', 'knowledge/documents')
	.setBeforeGuardHooks({
		collectionScope: async function (context, payload) {
			requireCollectionAccess(context.resources.knowledgeRepository, payload.collectionId, {
				tenantId: context.message.tenantId,
				principalId: context.message.principalId,
			})
		},
	})
	.setCommandFunction(async function (context, payload) {
		const tenantId = context.message.tenantId
		const initiatorPrincipalId = context.message.principalId
		if (tenantId !== 'tenant-north' || !isExampleActor(initiatorPrincipalId)) {
			throw new HandledError(StatusCode.Unauthorized, 'A verified tutorial identity is required for document ingestion')
		}
		const job = await context.queue.enqueue[queueName](payload, { tenantId, initiatorPrincipalId })
		return { jobId: job.jobId, queueName }
	})

const searchDocuments = builder
	.getCommandBuilder('searchDocuments', 'Searches only the caller-authorized banking document collection')
	.addPayloadSchema(z.object({ collectionId: collectionIdSchema, query: z.string().min(1).max(500) }))
	.addParameterSchema(emptyParameterSchema)
	.addOutputSchema(z.array(searchResultSchema))
	.exposeAsHttpEndpoint('POST', 'knowledge/search')
	.setBeforeGuardHooks({
		collectionScope: async function (context, payload) {
			requireCollectionAccess(context.resources.knowledgeRepository, payload.collectionId, {
				tenantId: context.message.tenantId,
				principalId: context.message.principalId,
			})
		},
	})
	.setCommandFunction(async function (context, payload) {
		return context.resources.knowledgeRepository.search(payload.collectionId, payload.query)
	})

const deleteDocument = builder
	.getCommandBuilder('deleteDocument', 'Deletes one document from the caller-authorized banking collection')
	.addPayloadSchema(z.undefined())
	.addParameterSchema(z.object({ collectionId: collectionIdSchema, documentId: documentIdSchema }))
	.addOutputSchema(z.object({ deleted: z.boolean() }))
	.exposeAsHttpEndpoint('DELETE', 'knowledge/collections/:collectionId/documents/:documentId')
	.setBeforeGuardHooks({
		collectionScope: async function (context, _payload, parameter) {
			requireCollectionAccess(context.resources.knowledgeRepository, parameter.collectionId, {
				tenantId: context.message.tenantId,
				principalId: context.message.principalId,
			})
		},
	})
	.setCommandFunction(async function (context, _payload, parameter) {
		return {
			deleted: context.resources.knowledgeRepository.deleteDocument(parameter.collectionId, parameter.documentId),
		}
	})

export const bankingKnowledgeService = builder
	.addAgentDefinition(await embedDocumentAgentBuilder.getDefinition())
	.addCommandDefinition(
		requestDocumentIngestion.getDefinition(),
		searchDocuments.getDefinition(),
		deleteDocument.getDefinition(),
	)

export { builder as bankingKnowledgeServiceBuilder }
