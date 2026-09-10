import { DefaultEventBridge, initDefaultStateStore, type Logger, type StateStore } from '@purista/core'
import { type HarnessStorage, type ModelProvider, sqliteHarnessStorage } from '@purista/harness'
import { openai } from '@purista/harness-openai'
import { honoV1Service } from '@purista/hono-http-server'
import { PgKnowledgeRepository } from './resources/PgKnowledgeRepository.js'
import { identityV1Service } from './service/identity/v1/identityV1Service.js'
import type { KnowledgeRepository } from './service/knowledge/v1/KnowledgeResources.js'
import { knowledgeV1Service } from './service/knowledge/v1/knowledgeV1Service.js'
import { createSessionProtectMiddleware } from './sessionProtectMiddleware.js'
import { registerStaticWebsite } from './staticWebsite.js'

export interface ManagedKnowledgeRepository extends KnowledgeRepository {
	readonly name: string
	destroy(): Promise<void>
}

export type KnowledgeApplicationDependencies = {
	stateStore: StateStore
	repository: ManagedKnowledgeRepository
	models: {
		primary: { provider: ModelProvider; model: string }
		embedding: { provider: ModelProvider; model: string }
	}
	embeddingDimensions: number
	storage?: HarnessStorage
}

function defaultDependencies(
	logger: Logger,
	environment: Readonly<Record<string, string | undefined>>,
): KnowledgeApplicationDependencies {
	const apiKey = environment.OPENAI_API_KEY?.trim()
	const databaseUrl = environment.DATABASE_URL?.trim()
	if (!apiKey) throw new Error('OPENAI_API_KEY is required to run the knowledge application.')
	if (!databaseUrl) throw new Error('DATABASE_URL is required to run the knowledge application.')
	const provider = openai({ apiKey })
	const embeddingModel = environment.OPENAI_EMBEDDING_MODEL?.trim() || 'text-embedding-3-small'
	const embeddingDimensions = 1_536
	return {
		stateStore: initDefaultStateStore({ logger }),
		repository: new PgKnowledgeRepository(databaseUrl, embeddingDimensions),
		models: {
			primary: { provider, model: environment.OPENAI_MODEL?.trim() || 'gpt-5-mini' },
			embedding: { provider, model: embeddingModel },
		},
		embeddingDimensions,
		storage: sqliteHarnessStorage({ file: environment.HARNESS_STORAGE_FILE?.trim() || './harness.sqlite' }),
	}
}

export async function createKnowledgeApplication(
	logger: Logger,
	dependencies?: KnowledgeApplicationDependencies,
	environment: Readonly<Record<string, string | undefined>> = process.env,
) {
	const resolved = dependencies ?? defaultDependencies(logger, environment)
	const storage =
		resolved.storage ?? sqliteHarnessStorage({ file: environment.HARNESS_STORAGE_FILE?.trim() || './harness.sqlite' })
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const identity = await identityV1Service.getInstance(eventBridge, {
		logger,
		stateStore: resolved.stateStore,
		serviceConfig: { sessionTtlMs: 15 * 60 * 1000 },
	})
	const knowledge = await knowledgeV1Service.getInstance(eventBridge, {
		logger,
		serviceConfig: {
			embeddingModel: resolved.models.embedding.model,
			embeddingDimensions: resolved.embeddingDimensions,
		},
		resources: {
			knowledgeCollectionPolicy: {
				canAccess: async ({ tenantId, principalId, collectionId }) =>
					tenantId === 'tenant-example' && principalId === 'principal-alex' && collectionId === 'customer-help',
			},
			knowledgeEmbeddingProfile: {
				model: resolved.models.embedding.model,
				dimensions: resolved.embeddingDimensions,
			},
			knowledgeRepository: resolved.repository,
		},
		ai: {
			storage,
			model: resolved.models.primary,
			models: {
				embedding: {
					...resolved.models.embedding,
					retry: {
						maxAttempts: 2,
						minDelayMs: 100,
						maxDelayMs: 1_000,
						maxActiveDelayMs: 5_000,
						maxActiveElapsedMs: 15_000,
						retryOn: { serverError: true },
					},
				},
			},
		},
	})
	const http = await honoV1Service.getInstance(eventBridge, {
		logger,
		serviceConfig: {
			apiMountPath: '/api',
			enableHealth: true,
			healthPath: '/health',
			openApi: {
				enabled: true,
				info: { title: 'Example Bank knowledge API', version: '1.0.0' },
				components: { securitySchemes: { sessionBearer: { type: 'http', scheme: 'bearer' } } },
			},
		},
	})

	http.setProtectMiddleware(createSessionProtectMiddleware(http))
	await identity.start()
	await knowledge.start()
	http.registerService(identity, knowledge)
	registerStaticWebsite(http)
	await http.start()
	return {
		eventBridge,
		stateStore: resolved.stateStore,
		repository: resolved.repository,
		identity,
		knowledge,
		http,
		harnessStorage: storage,
	}
}
