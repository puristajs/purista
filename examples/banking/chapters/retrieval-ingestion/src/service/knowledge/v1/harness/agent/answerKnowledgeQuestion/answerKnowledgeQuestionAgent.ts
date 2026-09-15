import { defineAgent } from '@purista/harness'
import { z } from 'zod'
import { answerKnowledgeQuestionInputSchema } from '../../../schema.js'
import { searchKnowledgeTool } from '../../tool/searchKnowledge/searchKnowledgeTool.js'

export const answerKnowledgeQuestionAgent = defineAgent('answerKnowledgeQuestion', {
	model: 'answering',
	input: answerKnowledgeQuestionInputSchema,
	output: z.string(),
	instructions:
		'Answer only from retrieved evidence. Cite sources as [documentId#chunkIndex]. If evidence is insufficient, say so.',
	prompt: (input) => ({ role: 'user', content: `${input.question}\nCollection: ${input.collectionId}` }),
	tools: [searchKnowledgeTool],
	governance: ({ native, rule }) => ({
		policies: [
			native({
				id: 'knowledgeAnswerApproval',
				rules: [rule({ id: 'searchKnowledgeApproval', tools: ['searchKnowledge'], effect: 'require_approval' })],
			}),
		],
	}),
	durable: true,
})
