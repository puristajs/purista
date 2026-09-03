import { HandledError, type HarnessBusinessGuardContext, StatusCode } from '@purista/core'
import { supportHarness } from '../../../../harness/support/supportHarness.js'
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
					) => {
						const { tenantId, principalId } = context.identity
						if (!tenantId || !principalId) {
							throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
						}
						if (!(await context.resources.supportClassificationPolicy.canClassify({ tenantId, principalId }))) {
							throw new HandledError(StatusCode.Forbidden, 'Support classification is not allowed')
						}
					},
				},
			},
		},
		workflows: {},
	},
} as const
