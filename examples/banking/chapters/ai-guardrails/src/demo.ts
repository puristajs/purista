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
			reason: 'The message contains card number 4111111111111111.',
		},
		usage: { inputTokens: 5, outputTokens: 5, totalTokens: 10 },
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
			{ messageId: 'MSG-302', text: 'I have a question about my card.' },
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
