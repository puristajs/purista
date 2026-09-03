import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'
import { createSupportApplication } from './createSupportApplication.js'

const usage = { inputTokens: 5, outputTokens: 4, totalTokens: 9 }

describe('mounted PURISTA agent tools', () => {
	it('lets the model call an authorized PURISTA command with the caller identity', async () => {
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
		const supportQuestionPolicy = { canAsk: vi.fn(async () => true) }
		const accountReadPolicy = { canRead: vi.fn(async () => true) }
		const transactionSummaryReader = {
			getById: vi.fn(async () => ({
				transactionId: 'tx-100',
				accountId: 'account-operating',
				tenantId: 'tenant-example',
				status: 'pending' as const,
				amount: 42,
				currency: 'EUR',
			})),
		}
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const { support, transaction } = await createSupportApplication(
			eventBridge,
			initLogger('fatal'),
			{ supportQuestionPolicy, accountReadPolicy, transactionSummaryReader },
			{ provider, model: 'fake-support' },
		)

		try {
			const response = await eventBridge.invoke(
				getCommandMessageMock({
					tenantId: 'tenant-example',
					principalId: 'principal-alex',
					receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'answerTransactionQuestion' },
					payload: {
						payload: {
							questionId: 'question-1',
							accountId: 'account-operating',
							transactionId: 'tx-100',
							question: 'What is the status of tx-100?',
						},
						parameter: {},
					},
				}),
			)

			expect(response).toEqual({
				answer: 'Transaction tx-100 is pending for EUR 42.',
				transactionIds: ['tx-100'],
			})
			expect(supportQuestionPolicy.canAsk).toHaveBeenCalledTimes(2)
			expect(supportQuestionPolicy.canAsk).toHaveBeenCalledWith({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				accountId: 'account-operating',
				transactionId: 'tx-100',
			})
			expect(accountReadPolicy.canRead).toHaveBeenCalledWith({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				accountId: 'account-operating',
			})
			expect(transactionSummaryReader.getById).toHaveBeenCalledWith('tx-100')
			provider.assertExhausted()
		} finally {
			await support.destroy()
			await transaction.destroy()
			await eventBridge.destroy()
		}
	})

	it('stops before the model and transaction service when agent access is denied', async () => {
		const provider = new FakeModelProvider({ strict: true })
		const accountReadPolicy = { canRead: vi.fn(async () => true) }
		const transactionSummaryReader = { getById: vi.fn() }
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const { support, transaction } = await createSupportApplication(
			eventBridge,
			initLogger('fatal'),
			{
				supportQuestionPolicy: { canAsk: vi.fn(async () => false) },
				accountReadPolicy,
				transactionSummaryReader,
			},
			{ provider, model: 'fake-support' },
		)

		try {
			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-other',
						receiver: {
							serviceName: 'Support',
							serviceVersion: '1',
							serviceTarget: 'answer_transaction_question',
						},
						payload: {
							payload: {
								questionId: 'question-2',
								accountId: 'account-operating',
								transactionId: 'tx-100',
								question: 'What is the status?',
							},
							parameter: {},
						},
					}),
				),
			).rejects.toMatchObject({ errorCode: 403 })
			expect(accountReadPolicy.canRead).not.toHaveBeenCalled()
			expect(transactionSummaryReader.getById).not.toHaveBeenCalled()
			provider.assertExhausted()
		} finally {
			await support.destroy()
			await transaction.destroy()
			await eventBridge.destroy()
		}
	})
})
