import { defineHarness } from '@purista/harness'

import { analyzeSignalsAgent } from './agent/analyzeSignalsAgent.js'
import { triageTicketAgent } from './agent/triageTicketAgent.js'
import { incidentHostTools } from './tool/incidentHostTools.js'
import { reviewRollbackWorkflow } from './workflow/reviewRollbackWorkflow.js'

/** Single portable Harness definition composed and mounted by the Support service. */
export const supportHarness = defineHarness({ name: 'support' })
	.requireModel('primary', { capabilities: ['object', 'tool_use'] })
	.use(incidentHostTools)
	.use(triageTicketAgent)
	.use(analyzeSignalsAgent)
	.use(reviewRollbackWorkflow)
	.define()
