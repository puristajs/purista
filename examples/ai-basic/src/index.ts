import 'dotenv/config'

import { createOpenAI } from '@ai-sdk/openai'
import { AiSdkProvider, agentProtocolEnvelopeSchema, invokeAgent, toAiSdkStreamEvents } from '@purista/ai'
import { DefaultEventBridge } from '@purista/core'

import { supportAgentDefinition } from './agents/supportAgent/v1/supportAgent.js'

async function main() {
	const eventBridge = new DefaultEventBridge()
	await eventBridge.start()

	const apiKey = process.env.OPENAI_API_KEY
	if (!apiKey) {
		throw new Error('Set OPENAI_API_KEY in your environment to run the example')
	}

	const openai = createOpenAI({ apiKey })
	const provider = new AiSdkProvider({
		model: openai('gpt-5.2-mini'),
		systemPrompt: 'You are a cheerful PURISTA support engineer.',
		defaults: { temperature: 0.2 },
	})

	const supportAgent = await supportAgentDefinition.getInstance({
		eventBridge,
		models: {
			'openai:gpt-5.2-mini': provider,
		},
	})
	await supportAgent.start()

	/**
	 * OPTION 1: Standalone invocation via invokeAgent
	 * Useful for scripts, HTTP controllers, or manual triggers.
	 */
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

	/**
	 * OPTION 2: Integrated invocation via context.invokeAgent
	 * (Inside a Command, Subscription or Stream)
	 *
	 * .canInvokeAgent('supportAgent', '1')
	 * .setCommandFunction(async (context, payload) => {
	 *    const result = await context.invokeAgent.supportAgent['1']
	 *      .call({ message: payload.prompt })
	 *      .final()
	 * })
	 */

	for await (const event of toAiSdkStreamEvents(envelopes)) {
		eventBridge.logger.info({ event }, 'ai-sdk stream event')
	}

	await supportAgent.stop()
	await eventBridge.destroy()
}

void main()
