import type { HarnessBusinessGuardContext } from '@purista/core'
import { defineHarness } from '@purista/harness'
import type { z } from 'zod'
import { requireSupportProcedureAccess } from '../requireSupportProcedureAccess.js'
import type { SupportProcedurePolicy } from '../SupportProcedurePolicy.js'
import { supportV1ServiceBuilder } from '../supportV1ServiceBuilder.js'
import { answerProcedureQuestionAgent } from './agent/answerProcedureQuestion/answerProcedureQuestionAgent.js'

export const supportHarness = defineHarness({ name: 'support', revision: 'support-v1' }).addAgent(
	answerProcedureQuestionAgent,
)

export const supportHarnessPolicy = supportV1ServiceBuilder.defineHarnessPolicy(supportHarness, {
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
})
