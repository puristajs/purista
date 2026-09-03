import type { HarnessStorage } from '@purista/harness'
import type { ReviewWaitSignal } from '../service/support/v1/SupportReviewResources.js'

export class HarnessReviewWaitSignal implements ReviewWaitSignal {
	public constructor(private readonly storage: HarnessStorage) {}

	public signal(input: { waitId: string; eventId: string; outcome: 'approved' | 'rejected' }) {
		return this.storage.signalWait(input)
	}
}
