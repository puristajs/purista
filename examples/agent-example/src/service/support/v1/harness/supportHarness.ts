import { defineHarness } from '@purista/harness'

import { supportV1ServiceBuilder } from '../supportV1ServiceBuilder.js'
import { analyzeSignalsAgent } from './agent/analyzeSignals/analyzeSignalsAgent.js'
import { triageTicketAgent } from './agent/triageTicket/triageTicketAgent.js'
import { reviewRollbackWorkflow } from './workflow/reviewRollback/reviewRollbackWorkflow.js'

/** One service-owned Harness definition mounted by Support v1. */
export const supportHarness = defineHarness({ name: 'support', revision: 'support-v1' })
	.addAgent(triageTicketAgent, analyzeSignalsAgent)
	.addWorkflow(reviewRollbackWorkflow)

export const supportHarnessPolicy = supportV1ServiceBuilder.defineHarnessPolicy(supportHarness, {
	agents: {
		triageTicket: {},
		analyzeSignals: {},
	},
	workflows: {
		reviewRollback: {},
	},
})
