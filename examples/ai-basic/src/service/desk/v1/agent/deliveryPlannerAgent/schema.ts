import { extendApi } from '@purista/core'
import { z } from 'zod'
import { architectureReviewAgentResponseSchema } from '../architectureReviewAgent/schema.js'

export const deliveryPlannerAgentInputSchema = extendApi(
	z.object({
		prompt: z.string().min(1),
		sessionId: z.string().min(1).optional(),
	}),
	{ title: 'Delivery planner input' },
)

export const deliveryPlannerAgentResponseSchema = extendApi(
	z.object({
		message: z.string().min(1),
		highlights: z.array(z.string().min(1)).min(1),
		recommendedNextActions: z.array(z.string().min(1)).min(1),
		researchSummary: z.string().optional(),
		architectureReview: architectureReviewAgentResponseSchema.optional(),
	}),
	{ title: 'Delivery planner response' },
)

export type DeliveryPlannerAgentInput = z.infer<typeof deliveryPlannerAgentInputSchema>
export type DeliveryPlannerAgentResponse = z.infer<typeof deliveryPlannerAgentResponseSchema>
