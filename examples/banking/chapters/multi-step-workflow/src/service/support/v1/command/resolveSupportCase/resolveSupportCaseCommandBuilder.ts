import { HandledError, StatusCode } from '@purista/core'
import {
	supportResolutionInputSchema,
	supportResolutionOutputSchema,
} from '../../../../../harness/support/supportResolutionSchemas.js'
import { durableResolutionIdentity } from '../../durableIdentity.js'
import { supportHarness } from '../../harness/supportHarnessMount.js'
import { requireSupportCaseResolution } from '../../requireSupportCaseResolution.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const resolveSupportCaseCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('resolveSupportCase', 'Run a durable multi-step support resolution')
	.addPayloadSchema(supportResolutionInputSchema)
	.addOutputSchema(supportResolutionOutputSchema)
	.canInvokeWorkflow('Support', '1', 'resolve_support_case', supportHarness.contracts.workflows.resolve_support_case)
	.setBeforeGuardHooks({
		caseAccess: async function (context, payload) {
			await requireSupportCaseResolution(context.resources.supportCasePolicy, {
				tenantId: context.message.tenantId,
				principalId: context.message.principalId,
				caseId: payload.caseId,
			})
		},
	})
	.setCommandFunction(async function (context, payload) {
		const tenantId = context.message.tenantId
		const principalId = context.message.principalId
		if (!tenantId || !principalId) throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
		const identity = durableResolutionIdentity(tenantId, principalId, payload.caseId)
		const outcome = await context.workflow.Support['1'].resolve_support_case.run(payload, {
			sessionId: identity.sessionId,
			durable: { runId: identity.runId },
		})
		if (outcome.status !== 'completed') throw new Error('Support resolution did not complete')
		return outcome.output
	})
