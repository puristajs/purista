import { randomUUID } from 'node:crypto'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

type Awaitable<T> = T | Promise<T>

export type CommandReliabilityHarness = {
	registerCommand: (options: { commandName: string; handler: () => Promise<unknown> }) => Promise<{
		unregister: () => Awaitable<void>
	}>
	invoke: (commandName: string, options?: { timeoutMs?: number }) => Promise<unknown>
	destroy: () => Awaitable<void>
}

export type CommandReliabilityContractConfig = {
	createHarness: () => Awaitable<CommandReliabilityHarness>
	cleanup?: (harness: CommandReliabilityHarness) => Awaitable<void>
	shouldSkip?: () => boolean
}

export const describeCommandReliabilityContract = (title: string, config: CommandReliabilityContractConfig) => {
	describe(title, () => {
		let harness: CommandReliabilityHarness | undefined
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
				throw new Error('Command reliability harness is not initialized')
			}
			return harness
		}

		it('rejects command invocation on timeout', async () => {
			if (skipCurrent) {
				expect(true).toBe(true)
				return
			}

			const activeHarness = getHarnessOrThrow()
			const commandName = `command.timeout.${randomUUID()}`
			const registration = await activeHarness.registerCommand({
				commandName,
				handler: async () => {
					await new Promise(resolve => setTimeout(resolve, 300))
					return { ok: true }
				},
			})

			try {
				await expect(activeHarness.invoke(commandName, { timeoutMs: 50 })).rejects.toMatchObject({
					errorCode: 504,
				})
			} finally {
				await registration.unregister()
			}
		})

		it('rejects pending invocations when the bridge is destroyed', async () => {
			if (skipCurrent) {
				expect(true).toBe(true)
				return
			}

			const activeHarness = getHarnessOrThrow()
			const commandName = `command.shutdown.${randomUUID()}`
			const registration = await activeHarness.registerCommand({
				commandName,
				handler: async () => {
					await new Promise(resolve => setTimeout(resolve, 500))
					return { ok: true }
				},
			})

			try {
				const invokePromise = activeHarness.invoke(commandName, { timeoutMs: 10_000 })
				await activeHarness.destroy()
				await expect(invokePromise).rejects.toMatchObject({
					errorCode: 503,
				})
			} finally {
				await registration.unregister()
			}
		})
	})
}
