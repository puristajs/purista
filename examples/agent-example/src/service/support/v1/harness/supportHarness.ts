import { defineHarness } from '@purista/harness'

import { analyzeSignalsAgent } from './agent/analyzeSignals/analyzeSignalsAgent.js'
import { triageTicketAgent } from './agent/triageTicket/triageTicketAgent.js'
import { reviewRollbackWorkflow } from './workflow/reviewRollback/reviewRollbackWorkflow.js'

/** One service-owned Harness definition mounted by Support v1. */
export const supportHarness = defineHarness({ name: 'support', revision: 'support-v1' })
	.addAgent(triageTicketAgent)
	.addAgent(analyzeSignalsAgent)
	.addWorkflow(reviewRollbackWorkflow)

export const supportHarnessPolicy = {
	agents: {
		triageTicket: {},
		analyzeSignals: {},
	},
	workflows: {
		reviewRollback: {},
	},
} as const
