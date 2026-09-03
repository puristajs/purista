import type { HarnessBusinessGuardContext } from '@purista/core'
import type { z } from 'zod'
import type { answerSupportQuestionInputSchema } from '../../../../harness/support/agent/answerSupportQuestion/answerSupportQuestionAgent.js'
import { supportHarness } from '../../../../harness/support/supportHarness.js'
import { requireSupportConversationAccess } from '../requireSupportConversationAccess.js'
import type { SupportConversationPolicy } from '../SupportConversationPolicy.js'

export { supportHarness }

export const supportHarnessPolicy = {
	publish: { agents: ['answer_support_question'], workflows: [] },
	targets: {
		agents: {
			answer_support_question: {
				beforeGuards: {
					conversationAccess: async (
						context: HarnessBusinessGuardContext<{ supportConversationPolicy: SupportConversationPolicy }>,
						input: z.output<typeof answerSupportQuestionInputSchema>,
					) => {
						await requireSupportConversationAccess(
							context.resources.supportConversationPolicy,
							context.identity,
							input.conversationId,
							'continue',
						)
					},
				},
			},
		},
		workflows: {},
	},
} as const
