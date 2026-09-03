import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { FakeModelProvider } from '@purista/harness/testing'
import { createSupportService } from './createSupportService.js'

async function main() {
	const provider = new FakeModelProvider({ strict: true })
	provider.enqueueObject({
		object: { category: 'card', urgency: 'normal', reason: 'The message asks about a replacement card.' },
		usage: { inputTokens: 8, outputTokens: 5, totalTokens: 13 },
		finishReason: 'stop',
	})
	const logger = initLogger('fatal')
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const support = await createSupportService(eventBridge, logger, {
		policy: { canClassify: async () => true },
		model: { provider, model: 'fake-classifier' },
	})
	await support.start()

	try {
		const result = await eventBridge.invoke(
			getCommandMessageMock({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'classifySupportMessage' },
				payload: {
					payload: { messageId: 'message-demo', text: 'How do I replace my expiring card?' },
					parameter: {},
				},
			}),
		)
		process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
		provider.assertExhausted()
	} finally {
		await support.destroy()
		await eventBridge.destroy()
	}
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'The evaluated-agent demo failed.'}\n`)
	process.exit(1)
})
