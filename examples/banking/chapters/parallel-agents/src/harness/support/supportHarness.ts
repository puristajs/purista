import { defineHarness } from '@purista/harness'
import { assessSupportRiskAgent } from './agent/assessSupportRisk/assessSupportRiskAgent.js'
import { planSupportResponseAgent } from './agent/planSupportResponse/planSupportResponseAgent.js'
import { analyzeSupportCaseWorkflow } from './workflow/analyzeSupportCase/analyzeSupportCaseWorkflow.js'

export const supportHarness = defineHarness({ name: 'support-case-analysis' })
	.requireModel('risk_model', { capabilities: ['object'] })
	.requireModel('response_model', { capabilities: ['object'] })
	.use(assessSupportRiskAgent)
	.use(planSupportResponseAgent)
	.use(analyzeSupportCaseWorkflow)
	.define()
