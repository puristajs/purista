import { type BuilderState, defineHarnessModule, type HostToolDefinition, type ModelAlias } from '@purista/harness'
import {
	answerKnowledgeQuestionInputSchema,
	retrievedEvidenceSchema,
	type searchKnowledgeInputSchema,
	type searchKnowledgeOutputSchema,
} from '../../../service/knowledge/v1/schema.js'

type RetrieveEvidenceState = BuilderState & {
	models: { primary: ModelAlias }
	tools: {
		search_knowledge: HostToolDefinition<typeof searchKnowledgeInputSchema, typeof searchKnowledgeOutputSchema>
	}
}

export const retrieveEvidenceAgent = defineHarnessModule<RetrieveEvidenceState>()('knowledge.agent.retrieve-evidence', {
	version: '1.0.0',
	register(builder) {
		return builder.agent('retrieve_evidence', {
			model: 'primary',
			input: answerKnowledgeQuestionInputSchema,
			output: retrievedEvidenceSchema,
			tools: ['search_knowledge'],
			maxSteps: 3,
			instructions: [
				'You retrieve evidence for a grounded answer.',
				'Call search_knowledge with the supplied collectionId and question.',
				'Return the question and only the evidence returned by the tool.',
				'Do not answer from memory and do not invent sources.',
			].join(' '),
		})
	},
})
