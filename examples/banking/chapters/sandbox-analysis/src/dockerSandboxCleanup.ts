import { rm } from 'node:fs/promises'
import type { ShutdownEntry } from '@purista/core'
import type { SandboxAdministration } from '@purista/harness'

export const transactionAnalysisSandboxSelector = {
	kind: 'tenant' as const,
	namespace: 'transactionAnalysis',
	tenantId: 'tenant-example',
}
export const transactionAnalysisSandboxCleanupKey = 'sandbox-analysis-live-cleanup'

export async function purgeTransactionAnalysisSandbox(
	administration: Pick<SandboxAdministration, 'purge'>,
	removeMetadataRoot: () => Promise<void>,
	wait: (milliseconds: number) => Promise<void> = (milliseconds) =>
		new Promise((resolve) => setTimeout(resolve, milliseconds)),
): Promise<void> {
	let result = await administration.purge({
		selector: transactionAnalysisSandboxSelector,
		idempotencyKey: transactionAnalysisSandboxCleanupKey,
		limit: 100,
	})
	for (let attempt = 0; result.state === 'cleanup_pending' && attempt < 3; attempt += 1) {
		await wait(result.retryAfterMs)
		result = await administration.purge({
			selector: transactionAnalysisSandboxSelector,
			idempotencyKey: transactionAnalysisSandboxCleanupKey,
			limit: 100,
		})
	}
	if (result.state !== 'completed') throw new Error('Transaction analysis sandbox cleanup did not complete.')
	await removeMetadataRoot()
}

export function transactionAnalysisSandboxCleanup(
	administration: Pick<SandboxAdministration, 'purge'>,
	metadataRoot: string,
): ShutdownEntry {
	return {
		name: 'transaction analysis sandbox cleanup',
		destroy: async () =>
			purgeTransactionAnalysisSandbox(administration, () => rm(metadataRoot, { recursive: true, force: true })),
	}
}
