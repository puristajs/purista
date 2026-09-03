import {
	classifySupportMessageInputSchema,
	classifySupportMessageOutputSchema,
} from '../../../../../harness/support/agent/classifySupportMessage/schema.js'
import { supportHarness } from '../../harness/supportHarnessMount.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const classifySupportMessageCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('classifySupportMessage', 'Classify one support message with the guarded agent')
	.addPayloadSchema(classifySupportMessageInputSchema)
	.addOutputSchema(classifySupportMessageOutputSchema)
	.canInvokeAgent('Support', '1', 'classify_support_message', supportHarness.contracts.agents.classify_support_message)
	.setCommandFunction(async function ({ agent }, payload) {
		const outcome = await agent.Support['1'].classify_support_message.run(payload, {
			sessionId: `support-message:${payload.messageId}`,
		})
		if (outcome.status !== 'completed') {
			throw new Error('Message classification was interrupted unexpectedly.')
		}
		return outcome.output
	})
