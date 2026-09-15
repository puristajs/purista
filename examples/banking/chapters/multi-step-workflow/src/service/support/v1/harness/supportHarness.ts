import type { HarnessBusinessGuardContext } from '@purista/core'
import { defineHarness } from '@purista/harness'
import type { z } from 'zod'
import { requireSupportCaseResolution } from '../requireSupportCaseResolution.js'
import type { SupportCasePolicy } from '../SupportResources.js'
import { supportV1ServiceBuilder } from '../supportV1ServiceBuilder.js'
import { resolveSupportCaseWorkflow } from './workflow/resolveSupportCase/resolveSupportCaseWorkflow.js'

export const supportHarness = defineHarness({ name: 'supportResolution', revision: 'v1' }).addWorkflow(
	resolveSupportCaseWorkflow,
)

export const supportHarnessPolicy = supportV1ServiceBuilder.defineHarnessPolicy(supportHarness, {
	workflows: {
		resolveSupportCase: {
			beforeGuards: {
				caseAccess: async (
					context: HarnessBusinessGuardContext<{ supportCasePolicy: SupportCasePolicy }>,
					input: z.output<typeof resolveSupportCaseWorkflow.contract.input>,
				) =>
					requireSupportCaseResolution(context.resources.supportCasePolicy, {
						...context.identity,
						caseId: input.caseId,
					}),
			},
		},
	},
})
