import { defineAgent } from '@purista/harness'
import { reviewSupportActionInputSchema } from '../../../schema.js'
import { freezeReviewedCardTool } from '../../tool/freezeReviewedCard/freezeReviewedCardTool.js'

export const reviewSupportActionAgent = defineAgent('reviewSupportApprovalAgent', {
	model: 'review',
	input: reviewSupportActionInputSchema,
	instructions: 'Use freezeReviewedCard exactly once so the requested action can enter human review.',
	tools: [freezeReviewedCardTool],
	governance: ({ native, rule }) => ({
		policies: [
			native({
				id: 'humanReview',
				rules: [rule({ id: 'freezeApproval', tools: ['freezeReviewedCard'], effect: 'require_approval' })],
			}),
		],
	}),
	prompt: (input) => ({ role: 'user', content: `Review ${input.requestId}: freeze the approved card.` }),
})
