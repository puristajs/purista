import { defineHarness } from '@purista/harness'
import { classifySupportMessageAgent } from './agent/classifySupportMessage/classifySupportMessageAgent.js'

export const supportHarness = defineHarness({ name: 'support' })
	.requireModel('primary', { capabilities: ['object'] })
	.use(classifySupportMessageAgent)
	.define()
