import {
	createStateStoreQueueJobStore,
	type Logger,
	type QueueBridge,
	type StateStore,
} from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { getEventBridge } from './eventbridge.js'
import type { ManagedTransactionRepository } from './resources/ManagedTransactionRepository.js'
import type { KnowledgeCollectionPolicy } from './service/knowledge/v1/KnowledgeCollectionPolicy.js'
import type {
	KnowledgeEmbeddingProvider,
	KnowledgeRepository,
} from './service/knowledge/v1/KnowledgeResources.js'
import { knowledgeV1Service } from './service/knowledge/v1/knowledgeV1Service.js'
import type { LocalIdentityProvider } from './service/identity/v1/LocalIdentityProvider.js'
import { identityV1Service } from './service/identity/v1/identityV1Service.js'
import { bankProfileV1Service } from './service/bankProfile/v1/bankProfileV1Service.js'
import { transactionV1Service } from './service/transaction/v1/transactionV1Service.js'
import { createSessionProtectMiddleware } from './sessionProtectMiddleware.js'
import { registerStaticWebsite } from './staticWebsite.js'

export const knowledgeJobStorePrefix = 'example-bank:knowledge-job'

export interface ManagedKnowledgeRepository extends KnowledgeRepository {
	destroy(): Promise<void>
}

export type KnowledgeApplicationDependencies = {
	transactionRepository: ManagedTransactionRepository
	identityProvider: LocalIdentityProvider
	identityStateStore: StateStore
	queueBridge: QueueBridge
	knowledgeStateStore: StateStore
	knowledgeCollectionPolicy: KnowledgeCollectionPolicy
	knowledgeEmbeddingProvider: KnowledgeEmbeddingProvider
	knowledgeRepository: ManagedKnowledgeRepository
}

export async function createKnowledgeApplication(
	logger: Logger,
	dependencies: KnowledgeApplicationDependencies,
) {
	const eventBridge = await getEventBridge(logger)
	const bankProfile = await bankProfileV1Service.getInstance(eventBridge, { logger })
	const identity = await identityV1Service.getInstance(eventBridge, {
		logger,
		serviceConfig: { sessionTtlMs: 15 * 60 * 1000 },
		resources: { identityProvider: dependencies.identityProvider },
		stateStore: dependencies.identityStateStore,
	})
	const transaction = await transactionV1Service.getInstance(eventBridge, {
		logger,
		resources: { transactionRepository: dependencies.transactionRepository },
	})
	const knowledgeJobStore = createStateStoreQueueJobStore(
		dependencies.knowledgeStateStore,
		knowledgeJobStorePrefix,
	)
	const knowledge = await knowledgeV1Service.getInstance(eventBridge, {
		logger,
		queueBridge: dependencies.queueBridge,
		queueJobStore: knowledgeJobStore,
		stateStore: dependencies.knowledgeStateStore,
		resources: {
			knowledgeCollectionPolicy: dependencies.knowledgeCollectionPolicy,
			knowledgeEmbeddingProvider: dependencies.knowledgeEmbeddingProvider,
			knowledgeRepository: dependencies.knowledgeRepository,
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
				info: { title: 'Example Bank API', version: '1.0.0' },
				components: {
					securitySchemes: { demoBearer: { type: 'http', scheme: 'bearer' } },
				},
			},
		},
	})

	http.setProtectMiddleware(createSessionProtectMiddleware(http))
	await bankProfile.start()
	await identity.start()
	await transaction.start()
	await knowledge.start()
	http.registerService(bankProfile, identity, transaction, knowledge)
	registerStaticWebsite(http)
	await http.start()

	return {
		eventBridge,
		bankProfile,
		identity,
		transaction,
		knowledge,
		knowledgeJobStore,
		http,
		...dependencies,
	}
}
