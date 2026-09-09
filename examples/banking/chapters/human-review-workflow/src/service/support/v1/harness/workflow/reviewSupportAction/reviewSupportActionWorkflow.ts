import { defineWorkflow } from '@purista/harness'
import { reviewSupportActionInputSchema, reviewSupportActionOutputSchema } from '../../../schema.js'
import { reviewSupportActionAgent } from '../../agent/reviewSupportAction/reviewSupportActionAgent.js'

export const reviewSupportActionWorkflow = defineWorkflow('reviewSupportAction', {
	input: reviewSupportActionInputSchema,
	output: reviewSupportActionOutputSchema,
	durable: true,
	agents: [reviewSupportActionAgent],
	handler: async (context) => {
		await context.agents.reviewSupportApprovalAgent.run(context.input, { callId: 'freeze-reviewed-card' })
		return { status: 'reviewed' as const }
	},
})
