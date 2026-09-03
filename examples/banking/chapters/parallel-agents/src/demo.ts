import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { FakeModelProvider } from '@purista/harness/testing'
import { createSupportService } from './createSupportService.js'

const usage = { inputTokens: 8, outputTokens: 5, totalTokens: 13 }

async function main() {
	const riskProvider = new FakeModelProvider({ strict: true })
	const responseProvider = new FakeModelProvider({ strict: true })
	riskProvider.enqueueObject({
		object: { level: 'high', evidence: ['The customer reports a missing card.'] },
		usage,
		finishReason: 'stop',
	})
	responseProvider.enqueueObject({
		object: { customerReply: 'We can help secure the card after verification.', nextAction: 'freeze_card' },
		usage,
		finishReason: 'stop',
	})
	const logger = initLogger('fatal')
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const support = await createSupportService(eventBridge, logger, {
		supportCasePolicy: { canAnalyze: async () => true },
		riskModel: { provider: riskProvider, model: 'risk-fake' },
		responseModel: { provider: responseProvider, model: 'response-fake' },
	})
	await support.start()

	try {
		const result = await eventBridge.invoke(
			getCommandMessageMock({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'analyzeSupportCase' },
				payload: {
					payload: { caseId: 'case-1', message: 'My card is missing.' },
					parameter: {},
				},
			}),
		)
		process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
		riskProvider.assertExhausted()
		responseProvider.assertExhausted()
	} finally {
		await support.destroy()
		await eventBridge.destroy()
	}
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'The parallel-agent demo failed.'}\n`)
	process.exit(1)
})
