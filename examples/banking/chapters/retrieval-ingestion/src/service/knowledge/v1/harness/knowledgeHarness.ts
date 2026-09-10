import type { HarnessBusinessGuardContext } from '@purista/core'
import { defineHarness } from '@purista/harness'
import type { z } from 'zod'
import type { KnowledgeCollectionPolicy } from '../KnowledgeResources.js'
import { requireKnowledgeCollectionAccess } from '../requireKnowledgeCollectionAccess.js'
import type { ingestKnowledgeInputSchema } from '../schema.js'
import { ingestKnowledgeWorkflow } from './workflow/ingestKnowledge/ingestKnowledgeWorkflow.js'

export const knowledgeHarness = defineHarness({ name: 'knowledge', revision: 'v1' }).addWorkflow(
	ingestKnowledgeWorkflow,
)

export const knowledgeHarnessPolicy = {
	targets: {
		workflows: {
			ingestKnowledge: {
				beforeGuards: {
					collectionAccess: async (
						context: HarnessBusinessGuardContext<{ knowledgeCollectionPolicy: KnowledgeCollectionPolicy }>,
						input: z.output<typeof ingestKnowledgeInputSchema>,
					) =>
						requireKnowledgeCollectionAccess(context.resources.knowledgeCollectionPolicy, {
							...context.identity,
							collectionId: input.collectionId,
							action: 'edit',
						}),
				},
			},
		},
	},
} as const
