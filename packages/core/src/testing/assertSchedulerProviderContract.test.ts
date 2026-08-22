import { describe, expect, it } from 'vitest'

import { DefaultSchedulerProvider } from '../core/Scheduler/DefaultSchedulerProvider.impl.js'
import { assertSchedulerProviderContract, SchedulerProviderContractError } from './assertSchedulerProviderContract.js'

class UnprovenDistributedProvider extends DefaultSchedulerProvider {
	override readonly capabilities = {
		durableOccurrenceState: true,
		distributedOccurrenceClaims: true,
		idempotentPublication: false,
	}
}

describe('assertSchedulerProviderContract', () => {
	it('proves the local provider contract without requiring a replica', async () => {
		await expect(
			assertSchedulerProviderContract({
				createProvider: () => new DefaultSchedulerProvider(),
			}),
		).resolves.toBeUndefined()
	})

	it('rejects an advertised distributed capability without replica proof', async () => {
		await expect(
			assertSchedulerProviderContract({
				createProvider: () => new UnprovenDistributedProvider(),
			}),
		).rejects.toBeInstanceOf(SchedulerProviderContractError)
	})
})
