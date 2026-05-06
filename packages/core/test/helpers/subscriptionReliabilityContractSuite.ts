import { randomUUID } from 'node:crypto'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

type Awaitable<T> = T | Promise<T>

export type SubscriptionDeadLetterObservation = {
	payload: unknown
	headers?: Record<string, string | undefined>
}

export type SubscriptionDeadLetterObserver = {
	next: () => Promise<SubscriptionDeadLetterObservation>
	destroy: () => Awaitable<void>
}

export type SubscriptionReliabilityHarness = {
	registerSubscription: (options: {
		eventName: string
		deadLetterTarget: string
		maxAttempts: number
		retryDelayMs: number
		handler: () => Promise<void>
	}) => Promise<{
		unregister: () => Awaitable<void>
	}>
	emitEvent: (eventName: string, payload: unknown) => Promise<void>
	observeDeadLetter: (target: string) => Promise<SubscriptionDeadLetterObserver>
}

export type SubscriptionReliabilityContractConfig = {
	createHarness: () => Awaitable<SubscriptionReliabilityHarness>
	cleanup?: (harness: SubscriptionReliabilityHarness) => Awaitable<void>
	shouldSkip?: () => boolean
}

const waitFor = async (predicate: () => boolean, timeoutMs = 8_000) => {
	const start = Date.now()
	while (Date.now() - start < timeoutMs) {
		if (predicate()) {
			return
		}
		await new Promise(resolve => setTimeout(resolve, 50))
	}

	throw new Error('Timed out waiting for subscription contract condition')
}

export const describeSubscriptionReliabilityContract = (
	title: string,
	config: SubscriptionReliabilityContractConfig,
) => {
	describe(title, () => {
		let harness: SubscriptionReliabilityHarness | undefined
		let skipCurrent = false

		beforeEach(async () => {
			skipCurrent = !!config.shouldSkip?.()
			if (skipCurrent) {
				harness = undefined
				return
			}

			harness = await config.createHarness()
		})

		afterEach(async () => {
			if (!harness) {
				return
			}

			try {
				await config.cleanup?.(harness)
			} finally {
				harness = undefined
			}
		})

		const getHarnessOrThrow = () => {
			if (!harness) {
				throw new Error('Subscription reliability harness is not initialized')
			}
			return harness
		}

		it('retries a transient subscription failure until the handler succeeds', async () => {
			if (skipCurrent) {
				expect(true).toBe(true)
				return
			}

			const activeHarness = getHarnessOrThrow()
			const eventName = `subscription.retry.${randomUUID()}`
			const deadLetterTarget = `${eventName}.dead-letter`
			let attempts = 0
			const registration = await activeHarness.registerSubscription({
				eventName,
				deadLetterTarget,
				maxAttempts: 3,
				retryDelayMs: 100,
				handler: async () => {
					attempts += 1
					if (attempts < 3) {
						throw new Error('retry me')
					}
				},
			})

			try {
				await activeHarness.emitEvent(eventName, { retry: true })
				await waitFor(() => attempts >= 3)
				expect(attempts).toBe(3)
			} finally {
				await registration.unregister()
			}
		})

		it('dead-letters poison subscription messages after the retry budget is exhausted', async () => {
			if (skipCurrent) {
				expect(true).toBe(true)
				return
			}

			const activeHarness = getHarnessOrThrow()
			const eventName = `subscription.dlq.${randomUUID()}`
			const deadLetterTarget = `${eventName}.dead-letter`
			const observer = await activeHarness.observeDeadLetter(deadLetterTarget)
			const registration = await activeHarness.registerSubscription({
				eventName,
				deadLetterTarget,
				maxAttempts: 2,
				retryDelayMs: 100,
				handler: async () => {
					throw new Error('poison message')
				},
			})

			try {
				await activeHarness.emitEvent(eventName, { deadLetter: true })
				const observed = await observer.next()
				expect(observed.payload).toMatchObject({
					eventName,
				})
				expect(observed.headers?.['x-purista-dead-letter-reason']).toContain('poison message')
			} finally {
				await registration.unregister()
				await observer.destroy()
			}
		})
	})
}
