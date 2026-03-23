import type { AgentExecutionPolicy } from '../types/AgentManifest.js'

export type ResolvedAgentExecutionPolicy = Required<
	Pick<
		AgentExecutionPolicy,
		| 'leaseTtlMs'
		| 'heartbeatIntervalMs'
		| 'maxLeaseExtensions'
		| 'maxAttempts'
		| 'maxDurationMs'
		| 'recovery'
		| 'httpBehavior'
		| 'scopeFromPayload'
	>
> & {
	cleanup: NonNullable<AgentExecutionPolicy['cleanup']>
}

export const resolveAgentExecutionPolicy = (policy: AgentExecutionPolicy | undefined): ResolvedAgentExecutionPolicy => {
	const leaseTtlMs = policy?.leaseTtlMs ?? 30_000
	const maxDurationMs = policy?.maxDurationMs ?? 15 * 60_000
	const derivedMaxLeaseExtensions = leaseTtlMs > 0 ? Math.max(3, Math.ceil(maxDurationMs / leaseTtlMs) + 1) : 3

	return {
		leaseTtlMs,
		heartbeatIntervalMs: policy?.heartbeatIntervalMs ?? 10_000,
		maxLeaseExtensions: policy?.maxLeaseExtensions ?? derivedMaxLeaseExtensions,
		maxAttempts: policy?.maxAttempts ?? 3,
		maxDurationMs,
		recovery: policy?.recovery ?? 'resume-from-checkpoints',
		httpBehavior: policy?.httpBehavior ?? 'attach-and-stream',
		cleanup: policy?.cleanup ?? {},
		scopeFromPayload: policy?.scopeFromPayload ?? [],
	}
}

export const deriveExecutionExtraScope = (payload: unknown, scopeKeys: string[]) => {
	if (!payload || typeof payload !== 'object' || scopeKeys.length === 0) {
		return undefined
	}

	const entries = scopeKeys
		.map(key => {
			const value = (payload as Record<string, unknown>)[key]
			return typeof value === 'string' && value.trim().length > 0 ? [key, value.trim()] : undefined
		})
		.filter((entry): entry is [string, string] => Array.isArray(entry))

	return entries.length > 0 ? Object.fromEntries(entries) : undefined
}
