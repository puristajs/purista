import { HandledError, StatusCode } from '@purista/core'
import {
	supportResolutionInputSchema,
	supportResolutionOutputSchema,
} from '../../../../../harness/support/supportResolutionWorkflow.js'
import { durableResolutionIdentity } from '../../durableIdentity.js'
import { supportResolutionHarness } from '../../harness/supportHarnessMount.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const resolveSupportCaseCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('resolveSupportCase', 'Run a durable multi-step support resolution')
	.addPayloadSchema(supportResolutionInputSchema)
	.addOutputSchema(supportResolutionOutputSchema)
	.canInvokeWorkflow(
		'Support',
		'1',
		'resolve_support_case',
		supportResolutionHarness.contracts.workflows.resolve_support_case,
	)
	.enableHttpSecurity(true)
	.exposeAsHttpEndpoint('POST', 'support/case-resolution')
	.setCommandFunction(async function (context, payload) {
		const tenantId = context.message.tenantId
		if (!tenantId) throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
		const identity = durableResolutionIdentity(tenantId, payload.caseId)
		const outcome = await context.workflow.Support['1'].resolve_support_case.run(payload, {
			sessionId: identity.sessionId,
			durable: { runId: identity.runId },
		})
		if (outcome.status !== 'completed') throw new Error('Support resolution did not complete')
		return outcome.output
	})
