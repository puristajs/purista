import { DefaultEventBridge, initDefaultStateStore, type Logger, type StateStore } from '@purista/core'
import type { ModelProvider } from '@purista/harness'
import { openai } from '@purista/harness-openai'
import { honoV1Service } from '@purista/hono-http-server'
import { deterministicKnowledgeEmbeddingProvider } from './resources/DeterministicKnowledgeEmbeddingProvider.js'
import { PgKnowledgeRepository } from './resources/PgKnowledgeRepository.js'
import { identityV1Service } from './service/identity/v1/identityV1Service.js'
import type { KnowledgeEmbeddingProvider, KnowledgeRepository } from './service/knowledge/v1/KnowledgeResources.js'
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
	embeddingProvider: KnowledgeEmbeddingProvider
	model: { provider: ModelProvider; model: string }
}

function defaultDependencies(
	logger: Logger,
	environment: Readonly<Record<string, string | undefined>>,
): KnowledgeApplicationDependencies {
	const apiKey = environment.OPENAI_API_KEY?.trim()
	const databaseUrl = environment.DATABASE_URL?.trim()
	if (!apiKey) throw new Error('OPENAI_API_KEY is required to run the knowledge application.')
	if (!databaseUrl) throw new Error('DATABASE_URL is required to run the knowledge application.')
	return {
		stateStore: initDefaultStateStore({ logger }),
		repository: new PgKnowledgeRepository(databaseUrl),
		embeddingProvider: deterministicKnowledgeEmbeddingProvider,
		model: {
			provider: openai({ apiKey }),
			model: environment.OPENAI_MODEL?.trim() || 'gpt-5-mini',
		},
	}
}

export async function createKnowledgeApplication(
	logger: Logger,
	dependencies?: KnowledgeApplicationDependencies,
	environment: Readonly<Record<string, string | undefined>> = process.env,
) {
	const resolved = dependencies ?? defaultDependencies(logger, environment)
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const identity = await identityV1Service.getInstance(eventBridge, {
		logger,
		stateStore: resolved.stateStore,
		serviceConfig: { sessionTtlMs: 15 * 60 * 1000 },
	})
	const knowledge = await knowledgeV1Service.getInstance(eventBridge, {
		logger,
		resources: {
			knowledgeCollectionPolicy: {
				canSearch: async ({ tenantId, principalId, collectionId }) =>
					tenantId === 'tenant-example' && principalId === 'principal-alex' && collectionId === 'customer-help',
			},
			knowledgeEmbeddingProvider: resolved.embeddingProvider,
			knowledgeRepository: resolved.repository,
		},
		ai: {
			models: {
				primary: resolved.model,
			},
			telemetry: { contentCaptureMode: 'NO_CONTENT' },
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
	}
}
