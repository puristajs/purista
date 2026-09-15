import { defineWorkflow } from '@purista/harness'
import { classifySupportCaseAgent } from '../../agent/classifySupportCase/classifySupportCaseAgent.js'
import { planSupportResolutionAgent } from '../../agent/planSupportResolution/planSupportResolutionAgent.js'
import {
	resolutionPlanInputSchema,
	resolutionPlanSchema,
	supportClassificationSchema,
	supportResolutionInputSchema,
	supportResolutionOutputSchema,
} from '../../supportResolutionSchemas.js'

export const selectHandlingLane = (classification: { urgency: 'normal' | 'urgent' }): 'priority' | 'standard' =>
	classification.urgency === 'urgent' ? 'priority' : 'standard'

export const resolveSupportCaseWorkflow = defineWorkflow('resolveSupportCase', {
	input: supportResolutionInputSchema,
	output: supportResolutionOutputSchema,
	agents: [classifySupportCaseAgent, planSupportResolutionAgent],
	agentCalls: { maxCalls: 2, maxParallel: 1 },
	durable: true,
	handler: async (context) => {
		const classification = supportClassificationSchema.parse(
			await context.agents.classifySupportCase.run(context.input, { callId: 'classify-case' }),
		)
		const planningInput = resolutionPlanInputSchema.parse(
			await context.step('select-handling-lane-v1', async () => ({
				caseId: context.input.caseId,
				message: context.input.message,
				classification,
				handlingLane: selectHandlingLane(classification),
			})),
		)
		const plan = resolutionPlanSchema.parse(
			await context.agents.planSupportResolution.run(planningInput, { callId: 'plan-resolution' }),
		)

		return { caseId: context.input.caseId, classification, plan }
	},
})
