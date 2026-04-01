import { describe, expect, it } from 'vitest'

import { InFlightExecutionTracker } from './InFlightExecutionTracker.impl.js'

describe('InFlightExecutionTracker', () => {
	it('tracks active executions and drains when work completes', async () => {
		const tracker = new InFlightExecutionTracker()
		let release!: () => void

		const pending = tracker.run(
			() =>
				new Promise<string>(resolve => {
					release = () => resolve('ok')
				}),
		)

		expect(tracker.size).toBe(1)

		setTimeout(() => release(), 5)

		await expect(tracker.waitForIdle(100)).resolves.toBe(true)
		await expect(pending).resolves.toBe('ok')
		expect(tracker.size).toBe(0)
	})

	it('times out when work does not finish in time', async () => {
		const tracker = new InFlightExecutionTracker()

		void tracker.run(() => new Promise<void>(() => undefined))

		await expect(tracker.waitForIdle(5)).resolves.toBe(false)
		expect(tracker.size).toBe(1)
	})
})
