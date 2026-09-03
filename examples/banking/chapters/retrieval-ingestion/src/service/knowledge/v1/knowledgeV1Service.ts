import { ingestKnowledgeCommandBuilder } from './command/ingestKnowledge/ingestKnowledgeCommandBuilder.js'
import { searchKnowledgeCommandBuilder } from './command/searchKnowledge/searchKnowledgeCommandBuilder.js'
import { knowledgeHarness, knowledgeHarnessPolicy } from './harness/knowledgeHarnessMount.js'
import { knowledgeV1ServiceBuilder } from './knowledgeV1ServiceBuilder.js'
import { answerKnowledgeQuestionStreamBuilder } from './stream/answerKnowledgeQuestion/answerKnowledgeQuestionStreamBuilder.js'

export const knowledgeV1Service = knowledgeV1ServiceBuilder
	.addCommandDefinition(ingestKnowledgeCommandBuilder.getDefinition(), searchKnowledgeCommandBuilder.getDefinition())
	.addStreamDefinition(answerKnowledgeQuestionStreamBuilder.getDefinition())
	.mountHarness(knowledgeHarness, knowledgeHarnessPolicy)
