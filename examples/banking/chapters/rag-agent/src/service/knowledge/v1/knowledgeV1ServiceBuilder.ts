import { ServiceBuilder, type ServiceInfoType } from '@purista/core'
import { generalKnowledgeServiceInfo } from '../generalKnowledgeServiceInfo.js'
import type {
	KnowledgeCollectionPolicy,
	KnowledgeEmbeddingProvider,
	KnowledgeRepository,
} from './KnowledgeResources.js'

export const knowledgeServiceInfo = {
	serviceVersion: '1',
	...generalKnowledgeServiceInfo,
} as const satisfies ServiceInfoType

export const knowledgeV1ServiceBuilder = new ServiceBuilder(knowledgeServiceInfo)
	.defineResource<'knowledgeCollectionPolicy', KnowledgeCollectionPolicy>()
	.defineResource<'knowledgeEmbeddingProvider', KnowledgeEmbeddingProvider>()
	.defineResource<'knowledgeRepository', KnowledgeRepository>()
