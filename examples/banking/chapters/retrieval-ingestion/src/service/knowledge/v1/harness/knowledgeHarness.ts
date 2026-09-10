import type { HarnessBusinessGuardContext } from '@purista/core'
import { defineHarness } from '@purista/harness'
import type { z } from 'zod'
import type { KnowledgeCollectionPolicy } from '../KnowledgeResources.js'
import { requireKnowledgeCollectionAccess } from '../requireKnowledgeCollectionAccess.js'
import type {
	answerKnowledgeQuestionInputSchema,
	ingestKnowledgeInputSchema,
	retrieveKnowledgeInputSchema,
} from '../schema.js'
import { answerKnowledgeQuestionAgent } from './agent/answerKnowledgeQuestion/answerKnowledgeQuestionAgent.js'
import { ingestKnowledgeWorkflow } from './workflow/ingestKnowledge/ingestKnowledgeWorkflow.js'
import { retrieveKnowledgeWorkflow } from './workflow/retrieveKnowledge/retrieveKnowledgeWorkflow.js'

export const knowledgeHarness = defineHarness({ name: 'knowledge', revision: 'v1' })
	.addWorkflow(ingestKnowledgeWorkflow)
	.addWorkflow(retrieveKnowledgeWorkflow)
	.addAgent(answerKnowledgeQuestionAgent)

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
			retrieveKnowledge: {
				beforeGuards: {
					collectionAccess: async (
						context: HarnessBusinessGuardContext<{ knowledgeCollectionPolicy: KnowledgeCollectionPolicy }>,
						input: z.output<typeof retrieveKnowledgeInputSchema>,
					) =>
						requireKnowledgeCollectionAccess(context.resources.knowledgeCollectionPolicy, {
							...context.identity,
							collectionId: input.collectionId,
							action: 'search',
						}),
				},
			},
		},
		agents: {
			answerKnowledgeQuestion: {
				beforeGuards: {
					collectionAccess: async (
						context: HarnessBusinessGuardContext<{ knowledgeCollectionPolicy: KnowledgeCollectionPolicy }>,
						input: z.output<typeof answerKnowledgeQuestionInputSchema>,
					) =>
						requireKnowledgeCollectionAccess(context.resources.knowledgeCollectionPolicy, {
							...context.identity,
							collectionId: input.collectionId,
							action: 'search',
						}),
				},
			},
		},
	},
} as const
