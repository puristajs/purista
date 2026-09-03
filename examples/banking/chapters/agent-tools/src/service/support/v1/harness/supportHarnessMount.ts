import type { HarnessBusinessGuardContext } from '@purista/core'
import { supportHarness } from '../../../../harness/support/supportHarness.js'
import {
	getTransactionSummaryOutputSchema,
	getTransactionSummaryParameterSchema,
	getTransactionSummaryPayloadSchema,
} from '../../../transaction/v1/schema.js'
import { requireSupportQuestion } from '../requireSupportQuestion.js'
import type { SupportQuestionPolicy } from '../SupportResources.js'
import { supportV1ServiceBuilder } from '../supportV1ServiceBuilder.js'

export { supportHarness }

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
	.setHandler(async (context, input) => {
		const { tenantId: _tenantId, ...summary } = await context.service.Transaction['1'].getTransactionSummary(input, {})
		return summary
	})
	.getDefinition()

export const supportHarnessPolicy = {
	publish: { agents: ['answer_transaction_question'], workflows: [] },
	hostTools: { lookup_transaction: lookupTransactionTool },
	targets: {
		agents: {
			answer_transaction_question: {
				beforeGuards: {
					mayUseSupportAgent: async (
						context: HarnessBusinessGuardContext<{ supportQuestionPolicy: SupportQuestionPolicy }>,
						input: { accountId: string; transactionId: string },
					) => {
						await requireSupportQuestion(context.resources.supportQuestionPolicy, {
							...context.identity,
							accountId: input.accountId,
							transactionId: input.transactionId,
						})
					},
				},
			},
		},
		workflows: {},
	},
} as const
