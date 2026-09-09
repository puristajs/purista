import { HandledError, StatusCode } from '@purista/core'
import {
	freezeCardInputSchema,
	freezeCardOutputSchema,
	freezeCardParameterSchema,
} from '../../../../../transaction/v1/schema.js'
import type { SupportReviewStore } from '../../../SupportReviewResources.js'
import { freezeReviewedCardInputSchema } from '../../../schema.js'
import { supportV1ServiceBuilder } from '../../../supportV1ServiceBuilder.js'

export const freezeReviewedCardTool = supportV1ServiceBuilder
	.defineTool('freezeReviewedCard', {
		description: 'Freeze the card for the already approved review attached to this run.',
		input: freezeReviewedCardInputSchema,
		output: freezeCardOutputSchema,
	})
	.canInvoke('Transaction', '1', 'freezeCard', freezeCardOutputSchema, freezeCardInputSchema, freezeCardParameterSchema)
	.setHandler(async (context) => {
		const tenantId = context.identity?.tenantId
		if (!tenantId) throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
		const record = await context.resources.supportReviewStore.getByAgentRunId(tenantId, context.tool.runId)
		if (record?.status !== 'approved') {
			throw new HandledError(StatusCode.Forbidden, 'This card freeze is not approved')
		}
		return context.service.Transaction['1'].freezeCard({ cardId: record.cardId }, { approvalId: record.runId })
	})

export type FreezeReviewedCardResources = Readonly<{ supportReviewStore: SupportReviewStore }>
