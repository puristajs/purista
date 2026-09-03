import { defineHarness } from '@purista/harness'
import { classifySupportCaseAgent } from './agent/classifySupportCase/classifySupportCaseAgent.js'
import { planSupportResolutionAgent } from './agent/planSupportResolution/planSupportResolutionAgent.js'
import { resolveSupportCaseWorkflow } from './workflow/resolveSupportCase/resolveSupportCaseWorkflow.js'

export const supportHarness = defineHarness({ name: 'support-resolution' })
	.requireModel('classification_model', { capabilities: ['object'] })
	.requireModel('resolution_model', { capabilities: ['object'] })
	.use(classifySupportCaseAgent)
	.use(planSupportResolutionAgent)
	.use(resolveSupportCaseWorkflow)
	.define()
