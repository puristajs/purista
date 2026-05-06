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

	it('tracks in-flight executions by kind', async () => {
		const tracker = new InFlightExecutionTracker()
		let releaseCommand!: () => void
		let releaseStream!: () => void

		const command = tracker.run(
			() =>
				new Promise<void>(resolve => {
					releaseCommand = resolve
				}),
			'command',
		)
		const stream = tracker.run(
			() =>
				new Promise<void>(resolve => {
					releaseStream = resolve
				}),
			'stream',
		)

		expect(tracker.getCounts()).toEqual({
			command: 1,
			subscription: 0,
			stream: 1,
			generic: 0,
		})

		await Promise.resolve()
		releaseCommand()
		await command
		expect(tracker.getCounts()).toEqual({
			command: 0,
			subscription: 0,
			stream: 1,
			generic: 0,
		})

		releaseStream()
		await stream
		expect(tracker.getCounts()).toEqual({
			command: 0,
			subscription: 0,
			stream: 0,
			generic: 0,
		})
	})
})
