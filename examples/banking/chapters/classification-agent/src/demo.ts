import { DefaultEventBridge, initLogger } from '@purista/core'
import { FakeModelProvider } from '@purista/harness/testing'
import { createSupportService } from './createSupportService.js'
import { invokeClassification } from './invokeClassification.js'

async function main() {
	const logger = initLogger('fatal')
	const provider = new FakeModelProvider({ strict: true })
	provider.enqueueObject({
		object: {
			category: 'card',
			urgency: 'normal',
			reason: 'The message asks about a replacement card without an immediate deadline.',
		},
		usage: { inputTokens: 10, outputTokens: 11, totalTokens: 21 },
		finishReason: 'stop',
	})
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const support = await createSupportService(eventBridge, logger, {
		policy: { canClassify: async () => true },
		model: { provider, model: 'fake-classifier' },
	})
	await support.start()

	try {
		const result = await invokeClassification(
			eventBridge,
			{ tenantId: 'tenant-example', principalId: 'principal-alex' },
			{ messageId: 'MSG-200', text: 'How do I replace an expiring card?' },
		)
		process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
		provider.assertExhausted()
	} finally {
		await support.destroy()
		await eventBridge.destroy()
	}
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'The demo failed.'}\n`)
	process.exit(1)
})
