import { ModelAdmissionRejectedError } from '@purista/harness'

import { HandledError } from '../core/Error/HandledError.impl.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import { toHarnessQueueRetry } from './queue.js'

describe('toHarnessQueueRetry', () => {
	it('maps local and EventBridge admission errors to the requested queue delay', () => {
		const local = new ModelAdmissionRejectedError(1_250, {
			providerId: 'provider',
			model: 'model',
			credentialScope: 'tenant',
			operation: 'object',
		})
		const remote = new HandledError(StatusCode.TooManyRequests, 'capacity unavailable', {
			code: 'MODEL_ADMISSION_REJECTED',
			retriable: true,
			retryAfterMs: 2_500,
		})

		expect(toHarnessQueueRetry(local)).toEqual({
			status: 'retry',
			reason: 'model_admission_rejected',
			delayMs: 1_250,
		})
		expect(toHarnessQueueRetry(remote)).toEqual({
			status: 'retry',
			reason: 'model_admission_rejected',
			delayMs: 2_500,
		})
	})

	it('does not reinterpret unrelated or malformed errors', () => {
		expect(toHarnessQueueRetry(new Error('failed'))).toBeUndefined()
		expect(
			toHarnessQueueRetry(
				new HandledError(StatusCode.TooManyRequests, 'capacity unavailable', {
					code: 'MODEL_ADMISSION_REJECTED',
					retriable: true,
					retryAfterMs: -1,
				}),
			),
		).toBeUndefined()
	})
})
