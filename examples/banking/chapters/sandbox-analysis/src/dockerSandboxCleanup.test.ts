import { describe, expect, it, vi } from 'vitest'
import {
	purgeTransactionAnalysisSandbox,
	transactionAnalysisSandboxCleanupKey,
	transactionAnalysisSandboxSelector,
} from './dockerSandboxCleanup.js'

const completed = { state: 'completed' as const, deletedResources: 1, remainingResources: 0 }
const pending = { state: 'cleanup_pending' as const, deletedResources: 0, remainingResources: 1, retryAfterMs: 1 }

describe('transaction analysis Docker cleanup', () => {
	it('accepts immediate completion', async () => {
		const purge = vi.fn().mockResolvedValue(completed)
		const removeRoot = vi.fn().mockResolvedValue(undefined)
		await expect(purgeTransactionAnalysisSandbox({ purge }, removeRoot, async () => undefined)).resolves.toBeUndefined()
		expect(purge).toHaveBeenCalledTimes(1)
		expect(removeRoot).toHaveBeenCalledOnce()
	})

	it('retries pending cleanup with the same request identity', async () => {
		const purge = vi.fn().mockResolvedValueOnce(pending).mockResolvedValueOnce(completed)
		const removeRoot = vi.fn().mockResolvedValue(undefined)
		await purgeTransactionAnalysisSandbox({ purge }, removeRoot, async () => undefined)
		expect(purge).toHaveBeenCalledTimes(2)
		expect(purge.mock.calls[0]?.[0]).toEqual(purge.mock.calls[1]?.[0])
		expect(purge.mock.calls[0]?.[0]).toMatchObject({
			selector: transactionAnalysisSandboxSelector,
			idempotencyKey: transactionAnalysisSandboxCleanupKey,
		})
		expect(removeRoot).toHaveBeenCalledOnce()
	})

	it('fails closed when cleanup remains pending', async () => {
		const purge = vi.fn().mockResolvedValue(pending)
		const removeRoot = vi.fn().mockResolvedValue(undefined)
		await expect(purgeTransactionAnalysisSandbox({ purge }, removeRoot, async () => undefined)).rejects.toThrow(
			'did not complete',
		)
		expect(purge).toHaveBeenCalledTimes(4)
		expect(removeRoot).not.toHaveBeenCalled()
	})
})
