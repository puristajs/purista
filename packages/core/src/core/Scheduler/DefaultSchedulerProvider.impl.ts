import { randomUUID } from 'node:crypto'

import type {
	SchedulerOccurrence,
	SchedulerOccurrenceClaim,
	SchedulerProvider,
	SchedulerProviderCapabilities,
} from './types.js'

/**
 * Process-local SchedulerProvider for development and deterministic tests.
 *
 * State is lost on restart and claims are not shared with other processes. Do
 * not use this provider to claim distributed or durable scheduling guarantees.
 *
 * @group Scheduler
 */
export class DefaultSchedulerProvider implements SchedulerProvider {
	public readonly name = 'DefaultSchedulerProvider'

	public readonly capabilities: SchedulerProviderCapabilities = {
		durableOccurrenceState: false,
		distributedOccurrenceClaims: false,
		idempotentPublication: false,
	}

	private readonly activeClaims = new Map<string, SchedulerOccurrenceClaim>()
	private readonly completedOccurrences = new Set<string>()

	/** Initialize the process-local provider. */
	async start() {}

	/** Claim an occurrence when it has not completed or been claimed in this process. */
	async claimOccurrence(occurrence: SchedulerOccurrence): Promise<SchedulerOccurrenceClaim | undefined> {
		if (this.completedOccurrences.has(occurrence.occurrenceId) || this.activeClaims.has(occurrence.occurrenceId)) {
			return undefined
		}

		const claim: SchedulerOccurrenceClaim = {
			...occurrence,
			claimId: randomUUID(),
		}
		this.activeClaims.set(occurrence.occurrenceId, claim)
		return claim
	}

	/** Mark a currently owned occurrence completed for this process lifetime. */
	async completeOccurrence(claim: SchedulerOccurrenceClaim) {
		const activeClaim = this.activeClaims.get(claim.occurrenceId)
		if (activeClaim?.claimId !== claim.claimId) {
			return
		}
		this.activeClaims.delete(claim.occurrenceId)
		this.completedOccurrences.add(claim.occurrenceId)
	}

	/** Release a failed occurrence so a later local tick can retry it. */
	async releaseOccurrence(claim: SchedulerOccurrenceClaim) {
		const activeClaim = this.activeClaims.get(claim.occurrenceId)
		if (activeClaim?.claimId === claim.claimId) {
			this.activeClaims.delete(claim.occurrenceId)
		}
	}

	/** Clear process-local state. It cannot affect another scheduler host. */
	async destroy() {
		this.activeClaims.clear()
		this.completedOccurrences.clear()
	}
}
