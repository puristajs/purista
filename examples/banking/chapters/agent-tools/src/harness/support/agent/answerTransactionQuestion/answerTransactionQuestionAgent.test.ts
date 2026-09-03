import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'
import { supportHarness } from '../../supportHarness.js'

const usage = { inputTokens: 5, outputTokens: 4, totalTokens: 9 }

describe('supportHarness', () => {
	it('lets the model choose the declared transaction lookup tool', async () => {
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
		const lookupTransaction = vi.fn(async () => ({
			transactionId: 'tx-100',
			accountId: 'account-operating',
			status: 'pending' as const,
			amount: 42,
			currency: 'EUR',
		}))
		const harness = await supportHarness.getInstance({
			models: { primary: { provider, model: 'fake-support' } },
			hostTools: { lookup_transaction: lookupTransaction },
		})

		try {
			const session = await harness.getSession('support-question:question-1')
			const outcome = await session.agents.answer_transaction_question.run(
				{
					questionId: 'question-1',
					accountId: 'account-operating',
					transactionId: 'tx-100',
					question: 'What is the status?',
				},
				{ hostContext: { identity: { tenantId: 'tenant-example', principalId: 'principal-alex' } } },
			)

			expect(lookupTransaction).toHaveBeenCalledWith(
				expect.objectContaining({ agentId: 'answer_transaction_question' }),
				{
					accountId: 'account-operating',
					transactionId: 'tx-100',
				},
			)
			expect(outcome).toMatchObject({
				status: 'completed',
				output: { answer: 'Transaction tx-100 is pending for EUR 42.', transactionIds: ['tx-100'] },
			})
			provider.assertExhausted()
		} finally {
			await harness.shutdown()
		}
	})
})
