import { describe, expect, it } from 'vitest'
import { searchKnowledgeTool } from '../../tool/searchKnowledge/searchKnowledgeTool.js'
import { answerKnowledgeQuestionAgent } from './answerKnowledgeQuestionAgent.js'

describe('answerKnowledgeQuestionAgent', () => {
	it('exposes only the model-selected retrieval tool and requires its approval', () => {
		expect(answerKnowledgeQuestionAgent.id).toBe('answerKnowledgeQuestion')
		expect(answerKnowledgeQuestionAgent.model).toBe('primary')
		expect(answerKnowledgeQuestionAgent.tools).toEqual([searchKnowledgeTool])
		expect(answerKnowledgeQuestionAgent.contract.interrupts).toEqual(['tool-approval'])
		expect(answerKnowledgeQuestionAgent.durable).toBe(true)
	})
})
