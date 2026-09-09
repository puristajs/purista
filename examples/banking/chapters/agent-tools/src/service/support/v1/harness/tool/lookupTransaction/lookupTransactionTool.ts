import {
	getTransactionSummaryOutputSchema,
	getTransactionSummaryParameterSchema,
	getTransactionSummaryPayloadSchema,
} from '../../../../../transaction/v1/command/getTransactionSummary/schema.js'
import { supportV1ServiceBuilder } from '../../../supportV1ServiceBuilder.js'

export const transactionSummaryForAgentSchema = getTransactionSummaryOutputSchema.omit({ tenantId: true })

export const lookupTransactionTool = supportV1ServiceBuilder
	.defineTool('lookupTransaction', {
		description: 'Look up one transaction the current caller may read.',
		input: getTransactionSummaryPayloadSchema,
		output: transactionSummaryForAgentSchema,
	})
	.canInvoke(
		'Transaction',
		'1',
		'getTransactionSummary',
		getTransactionSummaryOutputSchema,
		getTransactionSummaryPayloadSchema,
		getTransactionSummaryParameterSchema,
	)
	.setHandler(async (context, input) => {
		const { tenantId: _tenantId, ...summary } = await context.service.Transaction['1'].getTransactionSummary(input, {})
		return summary
	})
