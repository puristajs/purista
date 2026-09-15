import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { sqliteHarnessStorage } from '@purista/harness'
import { FakeModelProvider, textReply } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'
import { InMemorySupportReviewStore } from './resources/InMemorySupportReviewStore.js'
import { reviewIdentity } from './service/support/v1/reviewIdentity.js'
import type { SupportReviewPolicy } from './service/support/v1/SupportReviewResources.js'
import { supportV1Service } from './service/support/v1/supportV1Service.js'
import { transactionV1Service } from './service/transaction/v1/transactionV1Service.js'

class IdempotentCardFreezeExecutor {
	public readonly effects = vi.fn()
	private readonly results = new Map<string, { status: 'frozen'; cardId: string }>()

	public async freeze(input: { cardId: string; idempotencyKey: string }) {
		const existing = this.results.get(input.idempotencyKey)
		if (existing) return existing
		const result = { status: 'frozen' as const, cardId: input.cardId }
		this.results.set(input.idempotencyKey, result)
		this.effects(input)
		return result
	}
}

function reviewModel() {
	const provider = new FakeModelProvider({ strict: true })
	provider.enqueueText(
		textReply('', {
			toolCalls: [{ id: 'freeze-call', name: 'freezeReviewedCard', arguments: {} }],
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'tool_calls',
		}),
	)
	provider.enqueueText(
		textReply('reviewed', { usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 }, finishReason: 'stop' }),
	)
	return provider
}

const testHarnessStorage = () => sqliteHarnessStorage({ file: ':memory:' })

async function startReviewTestApplication(
	options: Readonly<{
		storage?: ReturnType<typeof testHarnessStorage>
		policy?: SupportReviewPolicy
	}> = {},
) {
	const storage = options.storage ?? testHarnessStorage()
	const reviews = new InMemorySupportReviewStore()
	const policy =
		options.policy ??
		({ canRequest: vi.fn(async () => true), canReview: vi.fn(async () => true) } satisfies SupportReviewPolicy)
	const executor = new IdempotentCardFreezeExecutor()
	const eventBridge = new DefaultEventBridge()
	await eventBridge.start()
	const transaction = await transactionV1Service.getInstance(eventBridge, {
		logger: initLogger('fatal'),
		resources: { cardFreezeExecutor: executor, cardFreezePolicy: { canFreeze: vi.fn(async () => true) } },
	})
	const support = await supportV1Service.getInstance(eventBridge, {
		logger: initLogger('fatal'),
		resources: {
			supportReviewStore: reviews,
			supportReviewPolicy: policy,
		},
		ai: { models: { review: { provider: reviewModel(), model: 'fake-review' } }, storage },
	})
	await transaction.start()
	await support.start()

	return {
		eventBridge,
		executor,
		reviews,
		async stop() {
			await support.destroy()
			await transaction.destroy()
			await eventBridge.destroy()
			await storage.close()
		},
	}
}

describe('durable human review over PURISTA', () => {
	it('returns waiting, resumes approval, and makes a duplicate delivery safe', async () => {
		const storage = testHarnessStorage()
		const reviews = new InMemorySupportReviewStore()
		const policy = { canRequest: vi.fn(async () => true), canReview: vi.fn(async () => true) }
		const canFreeze = vi.fn(
			async ({ tenantId, principalId, cardId, approvalId }) =>
				tenantId === 'tenant-example' &&
				principalId === 'principal-alex' &&
				cardId === 'card-1' &&
				approvalId.startsWith('support-review-run:'),
		)
		const executor = new IdempotentCardFreezeExecutor()
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const transaction = await transactionV1Service.getInstance(eventBridge, {
			resources: { cardFreezeExecutor: executor, cardFreezePolicy: { canFreeze } },
		})
		const support = await supportV1Service.getInstance(eventBridge, {
			logger: initLogger('fatal'),
			resources: {
				supportReviewStore: reviews,
				supportReviewPolicy: policy,
			},
			ai: { models: { review: { provider: reviewModel(), model: 'fake-review' } }, storage },
		})
		await transaction.start()
		await support.start()

		try {
			const waiting = await eventBridge.invoke(
				getCommandMessageMock({
					tenantId: 'tenant-example',
					principalId: 'principal-alex',
					receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'requestCardFreeze' },
					payload: {
						payload: { requestId: 'review-1', cardId: 'card-1', reason: 'Card is missing' },
						parameter: {},
					},
				}),
			)
			expect(waiting).toMatchObject({ status: 'waiting', requestId: 'review-1' })
			if (!waiting || typeof waiting !== 'object' || !('runId' in waiting) || typeof waiting.runId !== 'string') {
				throw new Error('Expected a typed waiting result')
			}

			const decisionMessage = getCommandMessageMock({
				tenantId: 'tenant-example',
				principalId: 'principal-reviewer',
				receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'decideCardFreeze' },
				payload: {
					payload: {
						requestId: 'review-1',
						expectedRevision: 1,
						eventId: 'decision-1',
						outcome: 'approved',
					},
					parameter: {},
				},
			})
			await expect(eventBridge.invoke(decisionMessage)).resolves.toEqual({ status: 'approved', requestId: 'review-1' })
			await expect(eventBridge.invoke(decisionMessage)).resolves.toEqual({ status: 'approved', requestId: 'review-1' })
			expect(executor.effects).toHaveBeenCalledTimes(1)
			expect(canFreeze).toHaveBeenCalledWith({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				cardId: 'card-1',
				approvalId: waiting.runId,
			})
		} finally {
			await support.destroy()
			await transaction.destroy()
			await eventBridge.destroy()
			await storage.close()
		}
	})

	it('does not execute the business effect after rejection', async () => {
		const storage = testHarnessStorage()
		const reviews = new InMemorySupportReviewStore()
		const executor = new IdempotentCardFreezeExecutor()
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const transaction = await transactionV1Service.getInstance(eventBridge, {
			resources: { cardFreezeExecutor: executor, cardFreezePolicy: { canFreeze: vi.fn(async () => true) } },
		})
		const support = await supportV1Service.getInstance(eventBridge, {
			resources: {
				supportReviewStore: reviews,
				supportReviewPolicy: { canRequest: vi.fn(async () => true), canReview: vi.fn(async () => true) },
			},
			ai: { models: { review: { provider: reviewModel(), model: 'fake-review' } }, storage },
		})
		await transaction.start()
		await support.start()

		try {
			await eventBridge.invoke(
				getCommandMessageMock({
					tenantId: 'tenant-example',
					principalId: 'principal-alex',
					receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'requestCardFreeze' },
					payload: {
						payload: { requestId: 'review-2', cardId: 'card-2', reason: 'Review requested' },
						parameter: {},
					},
				}),
			)
			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-reviewer',
						receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'decideCardFreeze' },
						payload: {
							payload: {
								requestId: 'review-2',
								expectedRevision: 1,
								eventId: 'decision-2',
								outcome: 'rejected',
							},
							parameter: {},
						},
					}),
				),
			).resolves.toEqual({ status: 'rejected', requestId: 'review-2' })
			expect(executor.effects).not.toHaveBeenCalled()
		} finally {
			await support.destroy()
			await transaction.destroy()
			await eventBridge.destroy()
			await storage.close()
		}
	})

	it('rejects a reviewer who fails the business policy before recording a decision', async () => {
		const application = await startReviewTestApplication({
			policy: { canRequest: vi.fn(async () => true), canReview: vi.fn(async () => false) },
		})

		try {
			await application.eventBridge.invoke(
				getCommandMessageMock({
					tenantId: 'tenant-example',
					principalId: 'principal-alex',
					receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'requestCardFreeze' },
					payload: {
						payload: { requestId: 'review-denied', cardId: 'card-denied', reason: 'Review requested' },
						parameter: {},
					},
				}),
			)
			await expect(
				application.eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-denied',
						receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'decideCardFreeze' },
						payload: {
							payload: {
								requestId: 'review-denied',
								expectedRevision: 1,
								eventId: 'decision-denied',
								outcome: 'approved',
							},
							parameter: {},
						},
					}),
				),
			).rejects.toMatchObject({ errorCode: 403 })
			expect(await application.reviews.get('tenant-example', 'review-denied')).toMatchObject({ status: 'pending' })
			expect(application.executor.effects).not.toHaveBeenCalled()
		} finally {
			await application.stop()
		}
	})

	it('does not find or resume another tenant review', async () => {
		const application = await startReviewTestApplication()

		try {
			await application.eventBridge.invoke(
				getCommandMessageMock({
					tenantId: 'tenant-example',
					principalId: 'principal-alex',
					receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'requestCardFreeze' },
					payload: {
						payload: { requestId: 'review-tenant', cardId: 'card-tenant', reason: 'Review requested' },
						parameter: {},
					},
				}),
			)
			await expect(
				application.eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-other',
						principalId: 'principal-reviewer',
						receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'decideCardFreeze' },
						payload: {
							payload: {
								requestId: 'review-tenant',
								expectedRevision: 1,
								eventId: 'decision-other-tenant',
								outcome: 'approved',
							},
							parameter: {},
						},
					}),
				),
			).rejects.toMatchObject({ errorCode: 404 })
			expect(application.executor.effects).not.toHaveBeenCalled()
		} finally {
			await application.stop()
		}
	})

	it('rejects stale revisions and conflicting terminal decisions in the review resource', async () => {
		const reviews = new InMemorySupportReviewStore()
		const identity = reviewIdentity({
			tenantId: 'tenant-example',
			requestId: 'review-concurrency',
			cardId: 'card-concurrency',
			reason: 'Review requested',
		})
		await reviews.create({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			requestId: 'review-concurrency',
			cardId: 'card-concurrency',
			reason: 'Review requested',
			...identity,
		})

		await expect(
			reviews.decide({
				tenantId: 'tenant-example',
				requestId: 'review-concurrency',
				expectedRevision: 2,
				eventId: 'decision-stale',
				outcome: 'approved',
				principalId: 'principal-reviewer',
			}),
		).rejects.toMatchObject({ errorCode: 409 })

		await reviews.decide({
			tenantId: 'tenant-example',
			requestId: 'review-concurrency',
			expectedRevision: 1,
			eventId: 'decision-approved',
			outcome: 'approved',
			principalId: 'principal-reviewer',
		})
		await expect(
			reviews.decide({
				tenantId: 'tenant-example',
				requestId: 'review-concurrency',
				expectedRevision: 2,
				eventId: 'decision-conflict',
				outcome: 'rejected',
				principalId: 'principal-reviewer',
			}),
		).rejects.toMatchObject({ errorCode: 409 })
	})
})
