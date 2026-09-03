import { fileURLToPath } from 'node:url'
import { defineHarness } from '@purista/harness'
import { answerProcedureQuestionAgent } from './agent/answerProcedureQuestion/answerProcedureQuestionAgent.js'

export const supportMethodsDirectory = fileURLToPath(new URL('../../../skills/support-methods/', import.meta.url))

export const supportHarness = defineHarness({ name: 'support-skills' })
	.requireModel('primary', { capabilities: ['object', 'tool_use'] })
	.skills({
		'support-methods': {
			directory: supportMethodsDirectory,
			validationMode: 'strict',
			trust: 'trusted',
			source: 'example-bank-repository',
		},
	})
	.use(answerProcedureQuestionAgent)
	.define()
