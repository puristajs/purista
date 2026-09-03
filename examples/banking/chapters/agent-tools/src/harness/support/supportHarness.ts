import { defineHarness } from '@purista/harness'
import { answerTransactionQuestionAgent } from './agent/answerTransactionQuestion/answerTransactionQuestionAgent.js'

export const supportHarness = defineHarness({ name: 'support-tools' })
	.requireModel('primary', { capabilities: ['object', 'tool_use'] })
	.use(answerTransactionQuestionAgent)
	.define()
