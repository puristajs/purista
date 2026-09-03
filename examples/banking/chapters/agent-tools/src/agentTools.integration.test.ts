import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'
import { supportV1Service } from './service/support/v1/supportV1Service.js'
import { transactionV1Service } from './service/transaction/v1/transactionV1Service.js'

const usage = { inputTokens: 5, outputTokens: 4, totalTokens: 9 }

describe('mounted PURISTA agent tools', () => {
	it('propagates identity, invokes a guarded command, and emits a declared event', async () => {
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
		const accountPolicy = { canRead: vi.fn(async () => true) }
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
		const emitted: unknown[] = []
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		await eventBridge.registerSubscription(
			{
				sender: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'lookup_transaction' },
				eventName: 'support.transactionSummaryRead',
				subscriber: { serviceName: 'Audit', serviceVersion: '1', serviceTarget: 'recordToolUse' },
				eventBridgeConfig: { durable: false, autoacknowledge: true, shared: true },
			},
			async (message) => {
				emitted.push({ payload: message.payload, tenantId: message.tenantId, principalId: message.principalId })
				return undefined
			},
		)
		const transaction = await transactionV1Service.getInstance(eventBridge, {
			resources: { accountReadPolicy: accountPolicy, transactionSummaryReader },
		})
		const support = await supportV1Service.getInstance(eventBridge, {
			logger: initLogger('fatal'),
			ai: { models: { primary: { provider, model: 'fake-support' } } },
		})
		await transaction.start()
		await support.start()

		try {
			const response = await eventBridge.invoke(
				getCommandMessageMock({
					tenantId: 'tenant-example',
					principalId: 'principal-alex',
					receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'answerTransactionQuestion' },
					payload: {
						payload: { questionId: 'question-1', question: 'What is the status of tx-100?' },
						parameter: {},
					},
				}),
			)

			expect(response).toEqual({
				answer: 'Transaction tx-100 is pending for EUR 42.',
				transactionIds: ['tx-100'],
			})
			expect(accountPolicy.canRead).toHaveBeenCalledWith({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				accountId: 'account-operating',
			})
			await new Promise((resolve) => process.nextTick(resolve))
			expect(emitted).toEqual([
				{
					payload: { transactionId: 'tx-100', toolCallId: 'lookup-1' },
					tenantId: 'tenant-example',
					principalId: 'principal-alex',
				},
			])
			provider.assertExhausted()
		} finally {
			await support.destroy()
			await transaction.destroy()
			await eventBridge.destroy()
		}
	})

	it('stops before reading a record when the command business guard denies access', async () => {
		const reader = { getById: vi.fn() }
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const transaction = await transactionV1Service.getInstance(eventBridge, {
			resources: {
				accountReadPolicy: { canRead: vi.fn(async () => false) },
				transactionSummaryReader: reader,
			},
		})
		await transaction.start()

		try {
			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-other',
						receiver: { serviceName: 'Transaction', serviceVersion: '1', serviceTarget: 'getTransactionSummary' },
						payload: {
							payload: { accountId: 'account-operating', transactionId: 'tx-100' },
							parameter: { idempotencyKey: `tool_${'a'.repeat(64)}` },
						},
					}),
				),
			).rejects.toMatchObject({ errorCode: 403 })
			expect(reader.getById).not.toHaveBeenCalled()
		} finally {
			await transaction.destroy()
			await eventBridge.destroy()
		}
	})
})
