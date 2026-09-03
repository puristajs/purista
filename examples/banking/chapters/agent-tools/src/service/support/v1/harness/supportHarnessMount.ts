import { z } from 'zod'
import { supportHarness } from '../../../../harness/support/supportHarness.js'
import {
	getTransactionSummaryOutputSchema,
	getTransactionSummaryParameterSchema,
	getTransactionSummaryPayloadSchema,
} from '../../../transaction/v1/schema.js'
import { supportV1ServiceBuilder } from '../supportV1ServiceBuilder.js'

export { supportHarness }

export const transactionSummaryReadEventSchema = z.strictObject({
	transactionId: z.string(),
	toolCallId: z.string(),
})

const lookupTransactionTool = supportV1ServiceBuilder
	.getHarnessHostToolBuilder(supportHarness.catalog.hostTools.lookup_transaction)
	.canInvoke(
		'Transaction',
		'1',
		'getTransactionSummary',
		getTransactionSummaryOutputSchema,
		getTransactionSummaryPayloadSchema,
		getTransactionSummaryParameterSchema,
	)
	.canEmit('support.transactionSummaryRead', transactionSummaryReadEventSchema)
	.setHandler(async (context, input) => {
		const { tenantId: _tenantId, ...summary } = await context.service.Transaction['1'].getTransactionSummary(input, {
			idempotencyKey: context.idempotencyKey,
		})
		await context.emit('support.transactionSummaryRead', {
			transactionId: input.transactionId,
			toolCallId: context.callId,
		})
		return summary
	})
	.getDefinition()

export const supportHarnessPolicy = {
	publish: { agents: ['answer_transaction_question'], workflows: [] },
	hostTools: { lookup_transaction: lookupTransactionTool },
	targets: { agents: {}, workflows: {} },
} as const
