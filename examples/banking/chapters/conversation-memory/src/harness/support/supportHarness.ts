import { defineHarness } from '@purista/harness'
import { answerSupportQuestionAgent } from './agent/answerSupportQuestion/answerSupportQuestionAgent.js'

export const supportHarness = defineHarness({ name: 'support-conversations' })
	.requireModel('primary', { capabilities: ['object'] })
	.defaults({ historyRetention: { maxTurns: 8, maxBytes: 32_000 } })
	.use(answerSupportQuestionAgent)
	.define()
