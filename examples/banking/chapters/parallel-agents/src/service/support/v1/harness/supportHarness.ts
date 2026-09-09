import type { HarnessBusinessGuardContext } from '@purista/core'
import { defineHarness } from '@purista/harness'
import type { z } from 'zod'
import { requireSupportCaseAnalysis } from '../requireSupportCaseAnalysis.js'
import type { SupportCasePolicy } from '../SupportResources.js'
import { analyzeSupportCaseWorkflow } from './workflow/analyzeSupportCase/analyzeSupportCaseWorkflow.js'

export const supportHarness = defineHarness({ name: 'supportParallelAnalysis', revision: 'v1' }).addWorkflow(
	analyzeSupportCaseWorkflow,
)

export const supportHarnessPolicy = {
	targets: {
		workflows: {
			analyzeSupportCase: {
				beforeGuards: {
					caseAccess: async (
						context: HarnessBusinessGuardContext<{ supportCasePolicy: SupportCasePolicy }>,
						input: z.output<typeof analyzeSupportCaseWorkflow.contract.input>,
					) =>
						requireSupportCaseAnalysis(context.resources.supportCasePolicy, {
							...context.identity,
							caseId: input.caseId,
						}),
				},
			},
		},
	},
} as const
