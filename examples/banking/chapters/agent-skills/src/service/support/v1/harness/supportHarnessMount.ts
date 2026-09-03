import type { HarnessBusinessGuardContext } from '@purista/core'
import type { z } from 'zod'
import type { answerProcedureQuestionInputSchema } from '../../../../harness/support/agent/answerProcedureQuestion/answerProcedureQuestionAgent.js'
import { supportHarness } from '../../../../harness/support/supportHarness.js'
import { requireSupportProcedureAccess } from '../requireSupportProcedureAccess.js'
import type { SupportProcedurePolicy } from '../SupportProcedurePolicy.js'

export { supportHarness }

export const supportHarnessPolicy = {
	publish: { agents: ['answer_procedure_question'], workflows: [] },
	targets: {
		agents: {
			answer_procedure_question: {
				beforeGuards: {
					procedureAccess: async (
						context: HarnessBusinessGuardContext<{ supportProcedurePolicy: SupportProcedurePolicy }>,
						input: z.output<typeof answerProcedureQuestionInputSchema>,
					) => {
						await requireSupportProcedureAccess(
							context.resources.supportProcedurePolicy,
							context.identity,
							input.caseId,
						)
					},
				},
			},
		},
		workflows: {},
	},
} as const
