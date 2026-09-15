import {
	classifySupportMessageAgent,
	classifySupportMessageInputSchema,
	classifySupportMessageOutputSchema,
} from '../../harness/agent/classifySupportMessage/classifySupportMessageAgent.js'
import { requireSupportClassification, supportClassificationSessionId } from '../../requireSupportClassification.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

/** A normal command that makes the agent's typed, address-first call observable to Framework tests. */
export const runClassifySupportMessageCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('runClassifySupportMessage', 'Classify one support message with the evaluated agent')
	.addPayloadSchema(classifySupportMessageInputSchema)
	.addOutputSchema(classifySupportMessageOutputSchema)
	.canInvokeAgent(supportV1ServiceBuilder.harnessTarget(classifySupportMessageAgent.contract))
	.setBeforeGuardHooks({
		messageAccess: async function (context, payload) {
			await requireSupportClassification(context.resources.supportClassificationPolicy, {
				tenantId: context.message.tenantId,
				principalId: context.message.principalId,
				messageId: payload.messageId,
			})
		},
	})
	.setCommandFunction(async function (context, payload) {
		const result = await context.agent.Support['1'][classifySupportMessageAgent.contract.id].run(payload, {
			sessionId: supportClassificationSessionId(context.message, payload.messageId),
		})
		return result.outcome.output
	})
