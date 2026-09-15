import { ServiceBuilder, type ServiceInfoType } from '@purista/core'
import { generalKnowledgeServiceInfo } from '../generalKnowledgeServiceInfo.js'
import type { KnowledgeCollectionPolicy } from './KnowledgeCollectionPolicy.js'
import type {
	KnowledgeEmbeddingProvider,
	KnowledgeRepository,
} from './KnowledgeResources.js'
import { knowledgeServiceV1ConfigSchema } from './knowledgeServiceConfig.js'

export const knowledgeServiceInfo = {
	serviceVersion: '1',
	...generalKnowledgeServiceInfo,
} as const satisfies ServiceInfoType

export const knowledgeV1ServiceBuilder = new ServiceBuilder(knowledgeServiceInfo)
	.setConfigSchema(knowledgeServiceV1ConfigSchema)
	.defineResource<'knowledgeCollectionPolicy', KnowledgeCollectionPolicy>()
	.defineResource<'knowledgeEmbeddingProvider', KnowledgeEmbeddingProvider>()
	.defineResource<'knowledgeRepository', KnowledgeRepository>()
