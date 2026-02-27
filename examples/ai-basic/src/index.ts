import { agentProtocolEnvelopeSchema, invokeAgent, toAiSdkStreamEvents } from '@purista/ai'
import { DefaultEventBridge } from '@purista/core'

import { supportAgentDefinition } from './agents/supportAgent/v1/supportAgent.js'

async function main() {
	const eventBridge = new DefaultEventBridge()
	await eventBridge.start()

	const supportAgent = await supportAgentDefinition.getInstance({
		eventBridge,
	})
	await supportAgent.start()

	const response = await invokeAgent({
		eventBridge,
		agentName: supportAgentDefinition.info.agentName,
		agentVersion: supportAgentDefinition.info.agentVersion,
		payload: {
			prompt: 'How do I reset my password?',
		},
	})

	const envelopes = agentProtocolEnvelopeSchema.array().parse(response)
	for (const envelope of envelopes) {
		eventBridge.logger.info({ frame: envelope.frame }, 'agent frame')
	}

	for await (const event of toAiSdkStreamEvents(envelopes)) {
		eventBridge.logger.info({ event }, 'ai-sdk stream event')
	}

	await supportAgent.stop()
	await eventBridge.destroy()
}

void main()
