import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { InMemoryHarnessStorage } from '@purista/harness'
import { describe, expect, it, vi } from 'vitest'
import { HarnessReviewWaitSignal } from './resources/HarnessReviewWaitSignal.js'
import { InMemorySupportReviewStore } from './resources/InMemorySupportReviewStore.js'
import { reviewIdentity } from './service/support/v1/reviewIdentity.js'
import type { ReviewWaitSignal, SupportReviewPolicy } from './service/support/v1/SupportReviewResources.js'
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

async function startReviewTestApplication(
	options: Readonly<{
		storage?: InMemoryHarnessStorage
		policy?: SupportReviewPolicy
		reviewWaitSignal?: ReviewWaitSignal
	}> = {},
) {
	const storage = options.storage ?? new InMemoryHarnessStorage()
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
			reviewWaitSignal: options.reviewWaitSignal ?? new HarnessReviewWaitSignal(storage),
		},
		ai: { models: {}, storage },
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
		},
	}
}

describe('durable human review over PURISTA', () => {
	it('returns waiting, resumes approval, and makes a duplicate delivery safe', async () => {
		const storage = new InMemoryHarnessStorage()
		const reviews = new InMemorySupportReviewStore()
		const policy = { canRequest: vi.fn(async () => true), canReview: vi.fn(async () => true) }
		const executor = new IdempotentCardFreezeExecutor()
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const transaction = await transactionV1Service.getInstance(eventBridge, {
			resources: { cardFreezeExecutor: executor, cardFreezePolicy: { canFreeze: vi.fn(async () => true) } },
		})
		const support = await supportV1Service.getInstance(eventBridge, {
			logger: initLogger('fatal'),
			resources: {
				supportReviewStore: reviews,
				supportReviewPolicy: policy,
				reviewWaitSignal: new HarnessReviewWaitSignal(storage),
			},
			ai: { models: {}, storage },
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
		} finally {
			await support.destroy()
			await transaction.destroy()
			await eventBridge.destroy()
		}
	})

	it('does not execute the business effect after rejection', async () => {
		const storage = new InMemoryHarnessStorage()
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
				reviewWaitSignal: new HarnessReviewWaitSignal(storage),
			},
			ai: { models: {}, storage },
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

	it('returns a conflict when the durable wait is unavailable', async () => {
		const application = await startReviewTestApplication({
			reviewWaitSignal: { signal: vi.fn(async () => ({ kind: 'not_found' as const })) },
		})

		try {
			await application.eventBridge.invoke(
				getCommandMessageMock({
					tenantId: 'tenant-example',
					principalId: 'principal-alex',
					receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'requestCardFreeze' },
					payload: {
						payload: { requestId: 'review-missing-wait', cardId: 'card-missing-wait', reason: 'Review requested' },
						parameter: {},
					},
				}),
			)
			await expect(
				application.eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-reviewer',
						receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'decideCardFreeze' },
						payload: {
							payload: {
								requestId: 'review-missing-wait',
								expectedRevision: 1,
								eventId: 'decision-missing-wait',
								outcome: 'approved',
							},
							parameter: {},
						},
					}),
				),
			).rejects.toMatchObject({ errorCode: 409 })
			expect(application.executor.effects).not.toHaveBeenCalled()
		} finally {
			await application.stop()
		}
	})

	it('expires a timed-out review without executing the approved effect', async () => {
		let now = Date.now()
		const storage = new InMemoryHarnessStorage({ now: () => new Date(now) })
		const application = await startReviewTestApplication({ storage })

		try {
			await application.eventBridge.invoke(
				getCommandMessageMock({
					tenantId: 'tenant-example',
					principalId: 'principal-alex',
					receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'requestCardFreeze' },
					payload: {
						payload: { requestId: 'review-expired', cardId: 'card-expired', reason: 'Review requested' },
						parameter: {},
					},
				}),
			)
			now += 16 * 60_000
			await expect(
				application.eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-reviewer',
						receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'decideCardFreeze' },
						payload: {
							payload: {
								requestId: 'review-expired',
								expectedRevision: 1,
								eventId: 'decision-expired',
								outcome: 'approved',
							},
							parameter: {},
						},
					}),
				),
			).resolves.toEqual({ status: 'expired', requestId: 'review-expired' })
			expect(application.executor.effects).not.toHaveBeenCalled()
		} finally {
			await application.stop()
		}
	})

	it('rejects stale revisions and conflicting terminal decisions in the review resource', async () => {
		const reviews = new InMemorySupportReviewStore()
		const identity = reviewIdentity(
			{
				tenantId: 'tenant-example',
				requestId: 'review-concurrency',
				cardId: 'card-concurrency',
				reason: 'Review requested',
			},
			new Date(Date.now() + 15 * 60_000).toISOString(),
		)
		await reviews.create({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			requestId: 'review-concurrency',
			cardId: 'card-concurrency',
			reason: 'Review requested',
			...identity,
			waitId: identity.workflowInput.waitId,
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
