import type { HarnessBusinessGuardContext } from '@purista/core'
import { defineHarness } from '@purista/harness'
import type { z } from 'zod'
import { requireSupportConversationAccess } from '../requireSupportConversationAccess.js'
import type { SupportConversationPolicy } from '../SupportConversationPolicy.js'
import { supportV1ServiceBuilder } from '../supportV1ServiceBuilder.js'
import { answerSupportQuestionAgent } from './agent/answerSupportQuestion/answerSupportQuestionAgent.js'

export const supportHarness = defineHarness({
	name: 'supportConversations',
	revision: 'support-v1',
	defaults: { historyRetention: { maxTurns: 8, maxBytes: 32_000 } },
}).addAgent(answerSupportQuestionAgent)

export const supportHarnessPolicy = supportV1ServiceBuilder.defineHarnessPolicy(supportHarness, {
	agents: {
		answerSupportQuestion: {
			beforeGuards: {
				conversationAccess: async (
					context: HarnessBusinessGuardContext<{
						supportConversationPolicy: SupportConversationPolicy
					}>,
					input: z.output<typeof answerSupportQuestionAgent.contract.input>,
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
})
