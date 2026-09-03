import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { inMemoryHarnessStorage } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { createSupportService } from './createSupportService.js'

const usage = { inputTokens: 8, outputTokens: 5, totalTokens: 13 }

async function main() {
	const classificationProvider = new FakeModelProvider({ strict: true })
	const resolutionProvider = new FakeModelProvider({ strict: true })
	classificationProvider.enqueueObject({
		object: { category: 'card', urgency: 'urgent' },
		usage,
		finishReason: 'stop',
	})
	resolutionProvider.enqueueObject({
		object: { summary: 'Verify the caller and secure the missing card.', nextAction: 'freeze_card' },
		usage,
		finishReason: 'stop',
	})
	const storage = inMemoryHarnessStorage()
	const logger = initLogger('fatal')
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const support = await createSupportService(eventBridge, logger, {
		supportCasePolicy: { canResolve: async () => true },
		storage,
		classificationModel: { provider: classificationProvider, model: 'classification-fake' },
		resolutionModel: { provider: resolutionProvider, model: 'resolution-fake' },
	})
	await support.start()

	try {
		const result = await eventBridge.invoke(
			getCommandMessageMock({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'resolveSupportCase' },
				payload: {
					payload: { caseId: 'case-1', message: 'My card is missing.' },
					parameter: {},
				},
			}),
		)
		process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
		classificationProvider.assertExhausted()
		resolutionProvider.assertExhausted()
	} finally {
		await support.destroy()
		await eventBridge.destroy()
		await storage.close()
	}
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'The multi-step workflow demo failed.'}\n`)
	process.exit(1)
})
