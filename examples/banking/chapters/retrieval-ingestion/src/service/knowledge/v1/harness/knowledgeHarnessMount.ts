import { commandAsHarnessTool, type HarnessBusinessGuardContext } from '@purista/core'
import type { z } from 'zod'
import { knowledgeHarness } from '../../../../harness/knowledge/knowledgeHarness.js'
import type { KnowledgeCollectionPolicy } from '../KnowledgeResources.js'
import { requireKnowledgeCollectionAccess } from '../requireKnowledgeCollectionAccess.js'
import type { answerKnowledgeQuestionInputSchema } from '../schema.js'

export { knowledgeHarness }

export const knowledgeHarnessPolicy = {
	publish: { workflows: ['answer_knowledge_question'] },
	hostTools: {
		search_knowledge: commandAsHarnessTool('Knowledge', '1', 'searchKnowledge'),
	},
	targets: {
		workflows: {
			answer_knowledge_question: {
				beforeGuards: {
					collectionAccess: async (
						context: HarnessBusinessGuardContext<{ knowledgeCollectionPolicy: KnowledgeCollectionPolicy }>,
						input: z.output<typeof answerKnowledgeQuestionInputSchema>,
					) => {
						await requireKnowledgeCollectionAccess(context.resources.knowledgeCollectionPolicy, {
							...context.identity,
							collectionId: input.collectionId,
							action: 'search',
						})
					},
				},
			},
		},
	},
} as const
