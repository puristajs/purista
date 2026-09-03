import { type AgentDefinition, type BuilderState, defineHarnessModule, type ModelAlias } from '@purista/harness'
import {
	answerKnowledgeQuestionInputSchema,
	type retrievedEvidenceSchema,
} from '../../../../service/knowledge/v1/schema.js'

type AnswerKnowledgeQuestionState = BuilderState & {
	models: { primary: ModelAlias }
	agents: {
		retrieve_evidence: AgentDefinition<any, typeof answerKnowledgeQuestionInputSchema, typeof retrievedEvidenceSchema>
	}
}

export const answerKnowledgeQuestionWorkflow = defineHarnessModule<AnswerKnowledgeQuestionState>()(
	'knowledge.workflow.answer-knowledge-question',
	{
		version: '1.0.0',
		register(builder) {
			return builder.workflow('answer_knowledge_question', {
				input: answerKnowledgeQuestionInputSchema,
				output: answerKnowledgeQuestionInputSchema.shape.question,
				updates: 'text-delta',
				delegation: { agents: ['retrieve_evidence'] },
				handler: async (context) => {
					const research = await context.agents.retrieve_evidence(context.input)
					let answer = ''
					for await (const chunk of context.models.primary.textStream(
						{
							messages: [
								{
									role: 'system',
									content:
										'Answer only from the supplied evidence. Cite sources as [documentId#chunkIndex]. If the evidence is insufficient, say so.',
								},
								{ role: 'user', content: JSON.stringify(research) },
							],
						},
						context.signal,
						{ emitRunEvents: true },
					)) {
						if (chunk.kind === 'delta') answer += chunk.text
					}
					return answer
				},
			})
		},
	},
)
