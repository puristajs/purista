import { DefaultEventBridge, initLogger } from '@purista/core'
import { openai } from '@purista/harness-openai'
import { createSupportApplication } from './createSupportApplication.js'
import { invokeSupportQuestion } from './invokeSupportQuestion.js'

async function main() {
	const logger = initLogger()
	const apiKey = process.env.OPENAI_API_KEY?.trim()
	if (!apiKey) throw new Error('OPENAI_API_KEY is required. Use npm run demo for the credential-free example.')
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const { support, transaction } = await createSupportApplication(
		eventBridge,
		logger,
		{
			supportQuestionPolicy: {
				canAsk: async ({ tenantId, principalId }) => tenantId === 'tenant-example' && principalId === 'principal-alex',
			},
			accountReadPolicy: {
				canRead: async ({ tenantId, principalId, accountId }) =>
					tenantId === 'tenant-example' && principalId === 'principal-alex' && accountId === 'account-operating',
			},
			transactionSummaryReader: {
				getById: async (transactionId) =>
					transactionId === 'tx-100'
						? {
								transactionId,
								accountId: 'account-operating',
								tenantId: 'tenant-example',
								status: 'pending',
								amount: 42,
								currency: 'EUR',
							}
						: undefined,
			},
		},
		{
			provider: openai({ apiKey }),
			model: process.env.OPENAI_MODEL?.trim() || 'gpt-5-mini',
		},
	)

	try {
		const answer = await invokeSupportQuestion(
			eventBridge,
			{ tenantId: 'tenant-example', principalId: 'principal-alex' },
			{
				questionId: 'live-question-1',
				accountId: 'account-operating',
				transactionId: 'tx-100',
				question: 'What is the status and amount of this transaction?',
			},
		)
		process.stdout.write(`${JSON.stringify(answer, null, 2)}\n`)
	} finally {
		await support.destroy()
		await transaction.destroy()
		await eventBridge.destroy()
	}
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'Agent tool services could not start.'}\n`)
	process.exit(1)
})
