import { HandledError, StatusCode } from '@purista/core'
import { durableResolutionIdentity } from '../../durableIdentity.js'
import { supportResolutionInputSchema, supportResolutionOutputSchema } from '../../harness/supportResolutionSchemas.js'
import { resolveSupportCaseWorkflow } from '../../harness/workflow/resolveSupportCase/resolveSupportCaseWorkflow.js'
import { requireSupportCaseResolution } from '../../requireSupportCaseResolution.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const runResolveSupportCaseCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('runResolveSupportCase', 'Run a durable multi-step support resolution')
	.addPayloadSchema(supportResolutionInputSchema)
	.addOutputSchema(supportResolutionOutputSchema)
	.canInvokeWorkflow(supportV1ServiceBuilder.harnessTarget(resolveSupportCaseWorkflow.contract))
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
		const result = await context.workflow.Support['1'][resolveSupportCaseWorkflow.contract.id].run(payload, {
			sessionId: identity.sessionId,
			durable: { runId: identity.runId },
		})
		if (result.outcome.status !== 'completed') {
			throw new HandledError(StatusCode.Conflict, 'Support resolution is waiting for continuation', {
				runId: result.outcome.runId,
				interrupt: result.outcome.interrupt,
			})
		}
		return result.outcome.output
	})
