import { DefaultEventBridge, initLogger } from '@purista/core'
import { FakeModelProvider } from '@purista/harness/testing'
import { createSupportService } from './createSupportService.js'
import { invokeProcedureAnswer } from './invokeProcedureAnswer.js'

const usage = { inputTokens: 8, outputTokens: 9, totalTokens: 17 }

async function main() {
	const logger = initLogger('fatal')
	const provider = new FakeModelProvider({ strict: true })
	provider.enqueueObject({
		object: {},
		toolCalls: [{ id: 'read-skill', name: 'read', arguments: { path: '/skills/support-methods/SKILL.md' } }],
		usage,
		finishReason: 'tool_calls',
	})
	provider.enqueueObject({
		object: {
			answer: 'A pending transfer can remain under review for up to two business days.',
			method: 'pending_transfer',
		},
		usage,
		finishReason: 'stop',
	})
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const support = await createSupportService(eventBridge, logger, {
		policy: { canAnswer: async () => true },
		model: { provider, model: 'fake-support' },
	})
	await support.start()

	try {
		const result = await invokeProcedureAnswer(
			eventBridge,
			{ tenantId: 'tenant-example', principalId: 'principal-alex' },
			{ caseId: 'case-104', question: 'How long can a transfer stay pending?' },
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
