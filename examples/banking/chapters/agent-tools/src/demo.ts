import { DefaultEventBridge, initLogger } from '@purista/core'
import { sqliteHarnessStorage } from '@purista/harness'
import { FakeModelProvider, objectReply } from '@purista/harness/testing'
import { createSupportApplication } from './createSupportApplication.js'
import { invokeSupportQuestion } from './invokeSupportQuestion.js'

const usage = { inputTokens: 5, outputTokens: 4, totalTokens: 9 }

async function main() {
	const logger = initLogger('fatal')
	const provider = new FakeModelProvider({ strict: true })
	provider.enqueueObject(
		objectReply(
			{},
			{
				toolCalls: [
					{
						id: 'lookup-1',
						name: 'lookupTransaction',
						arguments: { accountId: 'account-operating', transactionId: 'tx-100' },
					},
				],
				usage,
				finishReason: 'tool_calls',
			},
		),
	)
	provider.enqueueObject(
		objectReply(
			{ answer: 'Transaction tx-100 is pending for EUR 42.', transactionIds: ['tx-100'] },
			{ usage, finishReason: 'stop' },
		),
	)
	const storage = sqliteHarnessStorage({ file: 'agent-tools.sqlite' })
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
		storage,
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
		await storage.close()
	}
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'The demo failed.'}\n`)
	process.exit(1)
})
