import type { HarnessBusinessGuardContext } from '@purista/core'
import { defineHarness } from '@purista/harness'
import type { z } from 'zod'
import { requireSupportClassification } from '../requireSupportClassification.js'
import type { SupportClassificationPolicy } from '../SupportResources.js'
import { classifySupportMessageAgent } from './agent/classifySupportMessage/classifySupportMessageAgent.js'

/** One service-owned Harness graph. The evaluation runner uses this same definition directly. */
export const supportHarness = defineHarness({ name: 'support', revision: 'support-v1' }).addAgent(
	classifySupportMessageAgent,
)

export const supportHarnessPolicy = {
	targets: {
		agents: {
			classifySupportMessage: {
				beforeGuards: {
					mayClassifySupport: async (
						context: HarnessBusinessGuardContext<{ supportClassificationPolicy: SupportClassificationPolicy }>,
						input: z.output<typeof classifySupportMessageAgent.contract.input>,
					) => {
						await requireSupportClassification(context.resources.supportClassificationPolicy, {
							...context.identity,
							messageId: input.messageId,
						})
					},
				},
			},
		},
		workflows: {},
	},
} as const
