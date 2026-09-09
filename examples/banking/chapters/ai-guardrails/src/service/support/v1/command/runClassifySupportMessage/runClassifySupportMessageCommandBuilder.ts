import { classifySupportMessageAgent } from '../../harness/agent/classifySupportMessage/classifySupportMessageAgent.js'
import {
	classifySupportMessageInputSchema,
	classifySupportMessageOutputSchema,
} from '../../harness/agent/classifySupportMessage/schema.js'
import { requireSupportClassification, supportClassificationSessionId } from '../../requireSupportClassification.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const runClassifySupportMessageCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('runClassifySupportMessage', 'Classify one support message with the guarded agent')
	.addPayloadSchema(classifySupportMessageInputSchema)
	.addOutputSchema(classifySupportMessageOutputSchema)
	.canInvokeAgent('Support', '1', classifySupportMessageAgent.contract)
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
		if (result.outcome.status !== 'completed') {
			throw new Error('Message classification was interrupted unexpectedly.')
		}
		return result.outcome.output
	})
