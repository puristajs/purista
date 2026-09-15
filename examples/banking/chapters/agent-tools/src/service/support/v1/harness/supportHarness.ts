import type { HarnessBusinessGuardContext } from '@purista/core'
import { defineHarness } from '@purista/harness'
import type { z } from 'zod'
import { requireSupportQuestion } from '../requireSupportQuestion.js'
import type { SupportQuestionPolicy } from '../SupportResources.js'
import { supportV1ServiceBuilder } from '../supportV1ServiceBuilder.js'
import { answerTransactionQuestionAgent } from './agent/answerTransactionQuestion/answerTransactionQuestionAgent.js'

export const supportHarness = defineHarness({ name: 'support', revision: 'support-v1' }).addAgent(
	answerTransactionQuestionAgent,
)
export const supportHarnessPolicy = supportV1ServiceBuilder.defineHarnessPolicy(supportHarness, {
	agents: {
		answerTransactionQuestion: {
			beforeGuards: {
				mayUseSupportAgent: async (
					context: HarnessBusinessGuardContext<{ supportQuestionPolicy: SupportQuestionPolicy }>,
					input: z.output<typeof answerTransactionQuestionAgent.contract.input>,
				) =>
					requireSupportQuestion(context.resources.supportQuestionPolicy, {
						tenantId: context.identity.tenantId,
						principalId: context.identity.principalId,
						accountId: input.accountId,
						transactionId: input.transactionId,
					}),
			},
		},
	},
	workflows: {},
})
