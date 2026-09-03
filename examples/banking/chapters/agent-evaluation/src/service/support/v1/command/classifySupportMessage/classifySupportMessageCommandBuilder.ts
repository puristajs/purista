import { classificationInputSchema, classificationOutputSchema } from '../../../../../harness/support/supportHarness.js'
import { classificationHarness } from '../../harness/supportHarnessMount.js'
import { requireSupportClassification, supportClassificationSessionId } from '../../requireSupportClassification.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const classifySupportMessageCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('classifySupportMessage', 'Classify one support message with the evaluated agent')
	.addPayloadSchema(classificationInputSchema)
	.addOutputSchema(classificationOutputSchema)
	.canInvokeAgent(
		'Support',
		'1',
		'classify_support_message',
		classificationHarness.contracts.agents.classify_support_message,
	)
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
		const outcome = await context.agent.Support['1'].classify_support_message.run(payload, {
			sessionId: supportClassificationSessionId(context.message, payload.messageId),
		})
		if (outcome.status !== 'completed') {
			throw new Error('Message classification was interrupted unexpectedly.')
		}
		return outcome.output
	})
