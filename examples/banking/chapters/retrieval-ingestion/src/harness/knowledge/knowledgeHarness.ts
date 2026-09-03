import { defineHarness } from '@purista/harness'
import { answerKnowledgeQuestionInputSchema } from '../../service/knowledge/v1/schema.js'
import { retrieveEvidenceAgent } from './agent/retrieveEvidence/retrieveEvidenceAgent.js'
import { searchKnowledgeTool } from './tool/searchKnowledgeTool.js'

export const knowledgeHarness = defineHarness({ name: 'knowledge' })
	.requireModel('primary', { capabilities: ['object', 'tool_use', 'text_stream'] })
	.requireModel('embedding', { capabilities: ['embeddings'] })
	.use(searchKnowledgeTool)
	.use(retrieveEvidenceAgent)
	.workflow('answer_knowledge_question', {
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
	.define()
