import type { HarnessBusinessGuardContext } from '@purista/core'
import type { KnowledgeCollectionPolicy } from '../../../KnowledgeResources.js'
import { knowledgeV1ServiceBuilder } from '../../../knowledgeV1ServiceBuilder.js'
import { requireKnowledgeCollectionAccess } from '../../../requireKnowledgeCollectionAccess.js'
import { searchKnowledgeInputSchema, searchKnowledgeOutputSchema } from '../../../schema.js'
import { retrieveKnowledgeWorkflow } from '../../workflow/retrieveKnowledge/retrieveKnowledgeWorkflow.js'

export const searchKnowledgeTool = knowledgeV1ServiceBuilder
	.defineTool('searchKnowledge', {
		description: 'Search the authorized knowledge collection for source evidence.',
		input: searchKnowledgeInputSchema,
		output: searchKnowledgeOutputSchema,
	})
	.canInvokeWorkflow(knowledgeV1ServiceBuilder.harnessTarget(retrieveKnowledgeWorkflow.contract))
	.setHandler(async (context, input) => {
		await requireKnowledgeCollectionAccess(context.resources.knowledgeCollectionPolicy, {
			...context.identity,
			collectionId: input.collectionId,
			action: 'search',
		})
		return context.workflow.Knowledge['1'][retrieveKnowledgeWorkflow.contract.id].run(input, {
			callId: 'retrieve-knowledge',
		})
	})

export type SearchKnowledgePolicyContext = HarnessBusinessGuardContext<{
	knowledgeCollectionPolicy: KnowledgeCollectionPolicy
}>
