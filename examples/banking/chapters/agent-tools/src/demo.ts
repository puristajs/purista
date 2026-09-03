import { DefaultEventBridge, initLogger } from '@purista/core'
import { FakeModelProvider } from '@purista/harness/testing'
import { createSupportApplication } from './createSupportApplication.js'
import { invokeSupportQuestion } from './invokeSupportQuestion.js'

const usage = { inputTokens: 5, outputTokens: 4, totalTokens: 9 }

async function main() {
	const logger = initLogger('fatal')
	const provider = new FakeModelProvider({ strict: true })
	provider.enqueueObject({
		object: {},
		toolCalls: [
			{
				id: 'lookup-1',
				name: 'lookup_transaction',
				arguments: { accountId: 'account-operating', transactionId: 'tx-100' },
			},
		],
		usage,
		finishReason: 'tool_calls',
	})
	provider.enqueueObject({
		object: { answer: 'Transaction tx-100 is pending for EUR 42.', transactionIds: ['tx-100'] },
		usage,
		finishReason: 'stop',
	})
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const { support, transaction } = await createSupportApplication(
		eventBridge,
		logger,
		{
			supportQuestionPolicy: { canAsk: async () => true },
			accountReadPolicy: { canRead: async () => true },
			transactionSummaryReader: {
				getById: async (transactionId) => ({
					transactionId,
					accountId: 'account-operating',
					tenantId: 'tenant-example',
					status: 'pending',
					amount: 42,
					currency: 'EUR',
				}),
			},
		},
		{ provider, model: 'fake-support' },
	)

	try {
		const answer = await invokeSupportQuestion(
			eventBridge,
			{ tenantId: 'tenant-example', principalId: 'principal-alex' },
			{
				questionId: 'demo-question-1',
				accountId: 'account-operating',
				transactionId: 'tx-100',
				question: 'What is the status and amount of this transaction?',
			},
		)
		process.stdout.write(`${JSON.stringify(answer, null, 2)}\n`)
		provider.assertExhausted()
	} finally {
		await support.destroy()
		await transaction.destroy()
		await eventBridge.destroy()
	}
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'The demo failed.'}\n`)
	process.exit(1)
})
