import type { HarnessBusinessGuardContext } from '@purista/core'
import { supportHarness } from '../../../../harness/support/supportHarness.js'
import { requireSupportClassification } from '../requireSupportClassification.js'
import type { SupportClassificationPolicy } from '../SupportResources.js'

export { supportHarness }

export const supportHarnessPolicy = {
	publish: { agents: ['classify_support_message'], workflows: [] },
	targets: {
		agents: {
			classify_support_message: {
				beforeGuards: {
					mayClassifySupport: async (
						context: HarnessBusinessGuardContext<{
							supportClassificationPolicy: SupportClassificationPolicy
						}>,
						input: { messageId: string },
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
