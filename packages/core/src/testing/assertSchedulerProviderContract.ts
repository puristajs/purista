import { randomUUID } from 'node:crypto'

import type { SchedulerOccurrence, SchedulerProvider } from '../core/Scheduler/types.js'

/** A synchronous or asynchronous value accepted by scheduler provider test helpers. @group Scheduler */
export type SchedulerProviderAwaitable<T> = T | Promise<T>

/** Configuration for {@link assertSchedulerProviderContract}. @group Scheduler */
export type SchedulerProviderContractOptions = {
	/** Create a fresh provider connected to the test backend. */
	createProvider: () => SchedulerProviderAwaitable<SchedulerProvider>
	/**
	 * Create an independent provider instance that shares the same backend.
	 * Required when the provider advertises durable state or distributed claims.
	 */
	createReplica?: () => SchedulerProviderAwaitable<SchedulerProvider>
}

/** Error raised when a provider advertises a guarantee this contract cannot prove. @group Scheduler */
export class SchedulerProviderContractError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'SchedulerProviderContractError'
	}
}

/**
 * Prove the portable SchedulerProvider claim, release, completion, and replica
 * guarantees without depending on a specific test runner.
 *
 * Provider packages should call this from their test suite. A provider that
 * advertises durable completion state or distributed occurrence claims must
 * supply `createReplica`, returning an independently constructed instance that
 * shares its real or faithful test backend.
 *
 * @example
 * ```ts
 * await assertSchedulerProviderContract({
 *   createProvider: () => new DefaultSchedulerProvider(),
 * })
 * ```
 *
 * @group Scheduler
 */
export async function assertSchedulerProviderContract(options: SchedulerProviderContractOptions): Promise<void> {
	const provider = await options.createProvider()
	const requiresReplica =
		provider.capabilities.durableOccurrenceState || provider.capabilities.distributedOccurrenceClaims
	if (requiresReplica && !options.createReplica) {
		throw new SchedulerProviderContractError(
			`${provider.name} advertises durable state or distributed claims but does not provide an independent replica`,
		)
	}

	const occurrence: SchedulerOccurrence = {
		scheduleKey: `scheduler-provider-contract/${randomUUID()}`,
		occurrenceId: randomUUID(),
		scheduledAt: '2026-08-21T00:00:00.000Z',
	}
	let replica: SchedulerProvider | undefined

	try {
		await provider.start()
		const initialClaim = await provider.claimOccurrence(occurrence)
		if (!initialClaim) {
			throw new SchedulerProviderContractError(`${provider.name} did not claim a new occurrence`)
		}
		if (await provider.claimOccurrence(occurrence)) {
			throw new SchedulerProviderContractError(`${provider.name} allowed two active claims for one occurrence`)
		}

		await provider.completeOccurrence({ ...initialClaim, claimId: 'stale-claim-token' })
		await provider.releaseOccurrence(initialClaim)
		const completedClaim = await provider.claimOccurrence(occurrence)
		if (!completedClaim) {
			throw new SchedulerProviderContractError(`${provider.name} did not release a matching claim`)
		}
		await provider.completeOccurrence(completedClaim)
		if (await provider.claimOccurrence(occurrence)) {
			throw new SchedulerProviderContractError(`${provider.name} did not retain completed occurrence state`)
		}

		if (options.createReplica) {
			replica = await options.createReplica()
			await replica.start()
			if (provider.capabilities.durableOccurrenceState && (await replica.claimOccurrence(occurrence))) {
				throw new SchedulerProviderContractError(
					`${provider.name} advertises durable occurrence state but a replica re-claimed a completed occurrence`,
				)
			}

			const replicaOccurrence: SchedulerOccurrence = {
				...occurrence,
				occurrenceId: randomUUID(),
				scheduledAt: '2026-08-22T00:00:00.000Z',
			}
			const replicaClaim = await provider.claimOccurrence(replicaOccurrence)
			if (!replicaClaim) {
				throw new SchedulerProviderContractError(`${provider.name} did not claim a new replica occurrence`)
			}
			if (provider.capabilities.distributedOccurrenceClaims && (await replica.claimOccurrence(replicaOccurrence))) {
				throw new SchedulerProviderContractError(
					`${provider.name} advertises distributed claims but a replica claimed an active occurrence`,
				)
			}
			await provider.releaseOccurrence(replicaClaim)
		}
	} finally {
		await replica?.destroy()
		await provider.destroy()
	}
}
