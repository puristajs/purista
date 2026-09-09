import type { HarnessBusinessGuardContext } from '@purista/core'
import { defineHarness } from '@purista/harness'
import type { z } from 'zod'
import { requireSupportProcedureAccess } from '../requireSupportProcedureAccess.js'
import type { SupportProcedurePolicy } from '../SupportProcedurePolicy.js'
import { answerProcedureQuestionAgent } from './agent/answerProcedureQuestion/answerProcedureQuestionAgent.js'

export const supportHarness = defineHarness({ name: 'support', revision: 'support-v1' }).addAgent(
	answerProcedureQuestionAgent,
)

export const supportHarnessPolicy = {
	targets: {
		agents: {
			answerProcedureQuestion: {
				beforeGuards: {
					procedureAccess: async (
						context: HarnessBusinessGuardContext<{ supportProcedurePolicy: SupportProcedurePolicy }>,
						input: z.output<typeof answerProcedureQuestionAgent.contract.input>,
					) => requireSupportProcedureAccess(context.resources.supportProcedurePolicy, context.identity, input.caseId),
				},
			},
		},
		workflows: {},
	},
} as const
