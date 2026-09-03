import { isHarnessError } from '@purista/harness'

import { HandledError } from '../core/Error/HandledError.impl.js'
import type { QueueHandlerResult } from '../core/types/queue/QueueHandlerResult.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'

type QueueRetry = Extract<QueueHandlerResult, { status: 'retry' }>

/**
 * Convert Harness provider-admission backpressure into a native queue retry.
 *
 * This helper accepts both a local Harness error and the handled error received
 * after an address-first EventBridge invocation. Other failures return
 * `undefined` and should be rethrown by the worker.
 *
 * @example
 * ```ts
 * try {
 *   await context.agent.Knowledge['1'].answer.run(message.payload)
 *   return { status: 'success' }
 * } catch (error) {
 *   const retry = toHarnessQueueRetry(error)
 *   if (retry) return retry
 *   throw error
 * }
 * ```
 */
export function toHarnessQueueRetry(error: unknown): QueueRetry | undefined {
	if (isHarnessError(error) && error.code === 'MODEL_ADMISSION_REJECTED') {
		return retryFromDelay(error.meta?.retryAfterMs)
	}
	if (error instanceof HandledError && error.errorCode === StatusCode.TooManyRequests && isAdmissionData(error.data)) {
		return retryFromDelay(error.data.retryAfterMs)
	}
	return undefined
}

function retryFromDelay(value: unknown): QueueRetry | undefined {
	if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return undefined
	return Object.freeze({
		status: 'retry',
		reason: 'model_admission_rejected',
		delayMs: Math.ceil(value),
	})
}

function isAdmissionData(value: unknown): value is { retryAfterMs: number } {
	if (!value || typeof value !== 'object') return false
	const data = value as Record<string, unknown>
	return data.code === 'MODEL_ADMISSION_REJECTED' && data.retriable === true && typeof data.retryAfterMs === 'number'
}
