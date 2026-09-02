import {
	type DurableWorkspace,
	type HarnessStorage,
	inMemorySandbox,
	localDurableExecution,
	type Sandbox,
} from '@purista/harness'
import { type KubernetesSandboxRuntime, kubernetesSandboxRuntime } from '@purista/harness-sandbox-kubernetes'
import { postgresHarnessStorage } from '@purista/harness-storage-postgres'
import { Pool } from 'pg'

import {
	InMemoryRollbackReviewRepository,
	PostgresRollbackReviewRepository,
	type RollbackReviewRepository,
} from '../resource/rollbackReviewRepository.js'

export type AiExecutionAdapters = {
	readonly storage: HarnessStorage
	readonly sandbox: Sandbox
	readonly workspace?: DurableWorkspace
}

export type AiExecutionRuntime = {
	readonly mode: 'local' | 'postgres-local' | 'kubernetes'
	readonly ai: AiExecutionAdapters
	readonly reviewRepository: RollbackReviewRepository
	/** Idempotently closes adapter clients, including partial-startup ownership. */
	close(): Promise<void>
}

/**
 * Selects infrastructure once at the application composition root.
 * Attached agent and workflow definitions stay deployment-provider agnostic.
 */
export function createAiExecution(
	environment: Readonly<Record<string, string | undefined>> = process.env,
): AiExecutionRuntime {
	if (environment.PURISTA_AI_EXECUTION === undefined || environment.PURISTA_AI_EXECUTION === 'local') {
		const local = localDurableExecution({
			root: environment.PURISTA_LOCAL_RUNTIME_ROOT ?? '.local/harness',
			exec: false,
		})
		return {
			mode: 'local',
			ai: { storage: local.storage, sandbox: local.sandbox, workspace: local.workspace },
			reviewRepository: new InMemoryRollbackReviewRepository(),
			close: once(() => local.close()),
		}
	}
	if (environment.PURISTA_AI_EXECUTION === 'postgres-local') {
		const pool = new Pool({ connectionString: required(environment, 'DATABASE_URL') })
		const storage = postgresHarnessStorage({
			pool,
			leaseTtlMs: optionalPositiveInteger(environment.PURISTA_HARNESS_LEASE_TTL_MS, 120_000),
		})
		return {
			mode: 'postgres-local',
			ai: {
				storage,
				sandbox: inMemorySandbox(),
			},
			reviewRepository: new PostgresRollbackReviewRepository(pool),
			close: once(() => pool.end()),
		}
	}
	if (environment.PURISTA_AI_EXECUTION !== 'kubernetes') {
		throw new Error('PURISTA_AI_EXECUTION must be local, postgres-local, or kubernetes')
	}

	const pool = new Pool({ connectionString: required(environment, 'DATABASE_URL') })
	const storage = postgresHarnessStorage({
		pool,
		leaseTtlMs: optionalPositiveInteger(environment.PURISTA_HARNESS_LEASE_TTL_MS, 120_000),
	})
	const execution = kubernetesSandboxRuntime({
		namespace: required(environment, 'PURISTA_SANDBOX_NAMESPACE'),
		image: required(environment, 'PURISTA_SANDBOX_IMAGE'),
		runtimeId: environment.PURISTA_HARNESS_RUNTIME_ID ?? 'support-v1',
		serviceAccountName: environment.PURISTA_SANDBOX_SERVICE_ACCOUNT ?? 'purista-sandbox',
		...(environment.PURISTA_SANDBOX_STORAGE_CLASS
			? { storageClassName: environment.PURISTA_SANDBOX_STORAGE_CLASS }
			: {}),
		workspace: {
			...(environment.PURISTA_VOLUME_SNAPSHOT_CLASS
				? { snapshotClassName: environment.PURISTA_VOLUME_SNAPSHOT_CLASS }
				: {}),
		},
	})

	return {
		mode: 'kubernetes',
		ai: { storage, sandbox: execution.sandbox, workspace: execution.workspace },
		reviewRepository: new PostgresRollbackReviewRepository(pool),
		close: once(async () => closeProductionRuntime(pool, execution)),
	}
}

function required(environment: Readonly<Record<string, string | undefined>>, key: string): string {
	const value = environment[key]?.trim()
	if (!value) throw new Error(`${key} is required when PURISTA_AI_EXECUTION=kubernetes`)
	return value
}

function optionalPositiveInteger(value: string | undefined, fallback: number): number {
	if (value === undefined) return fallback
	const parsed = Number(value)
	if (!Number.isSafeInteger(parsed) || parsed <= 0) {
		throw new Error('PURISTA_HARNESS_LEASE_TTL_MS must be a positive integer')
	}
	return parsed
}

function once(close: () => Promise<void>): () => Promise<void> {
	let closePromise: Promise<void> | undefined
	return () => {
		closePromise ??= close()
		return closePromise
	}
}

async function closeProductionRuntime(pool: Pool, execution: KubernetesSandboxRuntime): Promise<void> {
	const results = await Promise.allSettled([pool.end(), execution.close()])
	const failure = results.find((result): result is PromiseRejectedResult => result.status === 'rejected')
	if (failure) throw failure.reason
}
