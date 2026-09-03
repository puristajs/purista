import { defineHarness } from '@purista/harness'
import { retrieveEvidenceAgent } from './agent/retrieveEvidence/retrieveEvidenceAgent.js'
import { searchKnowledgeTool } from './tool/searchKnowledgeTool.js'
import { answerKnowledgeQuestionWorkflow } from './workflow/answerKnowledgeQuestion/answerKnowledgeQuestionWorkflow.js'

export const knowledgeHarness = defineHarness({ name: 'knowledge' })
	.requireModel('primary', { capabilities: ['object', 'tool_use', 'text_stream'] })
	.requireModel('embedding', { capabilities: ['embeddings'] })
	.use(searchKnowledgeTool)
	.use(retrieveEvidenceAgent)
	.use(answerKnowledgeQuestionWorkflow)
	.define()
