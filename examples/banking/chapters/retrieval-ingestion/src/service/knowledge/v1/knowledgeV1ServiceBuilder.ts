import { ServiceBuilder, type ServiceInfoType } from '@purista/core'
import { z } from 'zod'
import { generalKnowledgeServiceInfo } from '../generalKnowledgeServiceInfo.js'
import type { KnowledgeCollectionPolicy, KnowledgeEmbeddingProfile, KnowledgeRepository } from './KnowledgeResources.js'

export const knowledgeServiceInfo = {
	serviceVersion: '1',
	...generalKnowledgeServiceInfo,
} as const satisfies ServiceInfoType

export const knowledgeV1ServiceBuilder = new ServiceBuilder(knowledgeServiceInfo)
	.setConfigSchema(
		z.object({
			embeddingModel: z.string().min(1),
			embeddingDimensions: z.number().int().positive(),
		}),
	)
	.defineResource<'knowledgeCollectionPolicy', KnowledgeCollectionPolicy>()
	.defineResource<'knowledgeEmbeddingProfile', KnowledgeEmbeddingProfile>()
	.defineResource<'knowledgeRepository', KnowledgeRepository>()
