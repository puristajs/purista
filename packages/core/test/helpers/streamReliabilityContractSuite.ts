import { randomUUID } from 'node:crypto'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

type Awaitable<T> = T | Promise<T>

export type StreamReliabilityHarness = {
	openStream: (options: {
		streamName: string
		timeoutMs?: number
	}) => Promise<AsyncIterable<{ payload: { frameType: string } }>>
	destroy: () => Awaitable<void>
}

export type StreamReliabilityContractConfig = {
	createHarness: () => Awaitable<StreamReliabilityHarness>
	cleanup?: (harness: StreamReliabilityHarness) => Awaitable<void>
	shouldSkip?: () => boolean
}

export const describeStreamReliabilityContract = (title: string, config: StreamReliabilityContractConfig) => {
	describe(title, () => {
		let harness: StreamReliabilityHarness | undefined
		let skipCurrent = false

		beforeEach(async () => {
			skipCurrent = !!config.shouldSkip?.()
			if (skipCurrent) {
				harness = undefined
				return
			}

			harness = await config.createHarness()
		})

		afterEach(async () => {
			if (!harness) {
				return
			}
			try {
				await config.cleanup?.(harness)
			} finally {
				harness = undefined
			}
		})

		const getHarnessOrThrow = () => {
			if (!harness) {
				throw new Error('Stream reliability harness is not initialized')
			}
			return harness
		}

		it('delivers deterministic terminal stream frames', async () => {
			if (skipCurrent) {
				expect(true).toBe(true)
				return
			}

			const activeHarness = getHarnessOrThrow()
			const streamName = `stream.terminal.${randomUUID()}`
			const frameTypes: string[] = []
			const handle = await activeHarness.openStream({
				streamName,
			})

			for await (const frame of handle) {
				frameTypes.push(frame.payload.frameType)
			}

			expect(frameTypes.length).toBeGreaterThan(0)
			expect(frameTypes.at(-1)).toMatch(/complete|error|cancel/)
		})
	})
}
