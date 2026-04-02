import {
	isSubscriptionHandlerControlResult,
	type SubscriptionHandlerControlResult,
} from './SubscriptionHandlerResult.js'

export class SubscriptionConsumerControlError extends Error {
	public readonly outcome: SubscriptionHandlerControlResult['status']
	public readonly reason?: string
	public readonly delayMs?: number

	constructor(result: SubscriptionHandlerControlResult)
	constructor(outcome: SubscriptionHandlerControlResult['status'], reason?: string, delayMs?: number)
	constructor(
		arg1: SubscriptionHandlerControlResult | SubscriptionHandlerControlResult['status'],
		arg2?: string,
		arg3?: number,
	) {
		const result: SubscriptionHandlerControlResult =
			typeof arg1 === 'string'
				? arg1 === 'retry'
					? { status: 'retry', reason: arg2, delayMs: arg3 }
					: { status: 'deadLetter', reason: arg2 }
				: arg1
		super(
			result.status === 'retry'
				? (result.reason ?? 'subscription requested retry')
				: (result.reason ?? 'subscription requested dead-letter'),
		)
		this.name = 'SubscriptionConsumerControlError'
		this.outcome = result.status
		this.reason = result.reason
		this.delayMs = result.status === 'retry' ? result.delayMs : undefined
	}
}

export const isSubscriptionConsumerControlError = (value: unknown): value is SubscriptionConsumerControlError => {
	if (value instanceof SubscriptionConsumerControlError) {
		return true
	}
	if (!(value instanceof Error)) {
		return false
	}
	const candidate = value as SubscriptionConsumerControlError
	return isSubscriptionHandlerControlResult({
		status: candidate.outcome,
		reason: candidate.reason,
		delayMs: candidate.delayMs,
	})
}
