export type SubscriptionHandlerResult =
	| { status: 'ack' }
	| { status: 'retry'; reason?: string; delayMs?: number }
	| { status: 'deadLetter'; reason?: string }

export type SubscriptionHandlerControlResult = Exclude<SubscriptionHandlerResult, { status: 'ack' }>

export const isSubscriptionHandlerResult = (value: unknown): value is SubscriptionHandlerResult => {
	if (!value || typeof value !== 'object') {
		return false
	}

	const status = (value as { status?: unknown }).status
	return status === 'ack' || status === 'retry' || status === 'deadLetter'
}

export const isSubscriptionHandlerControlResult = (value: unknown): value is SubscriptionHandlerControlResult => {
	if (!isSubscriptionHandlerResult(value)) {
		return false
	}
	return value.status === 'retry' || value.status === 'deadLetter'
}
