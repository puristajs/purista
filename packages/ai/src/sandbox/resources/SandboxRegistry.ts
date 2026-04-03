import { randomUUID } from 'node:crypto'
import type { StateStore } from '@purista/core'
import { type SandboxMetadata, SandboxMetadataSchema, type SandboxOwner } from '../types/SandboxDriver.js'

/**
 * SandboxRegistry - A state-store backed registry for tracking active sandboxes.
 * This class handles the persistence of sandbox metadata and provides reconciliation
 * logic for self-healing after service restarts.
 *
 * @group Resources
 */
export class SandboxRegistry {
	private store: StateStore
	private prefix = 'sandbox:registry:'
	private ownerPrefix = 'sandbox:owner:'
	private ownerProvisionLockPrefix = 'sandbox:owner-lock:'

	/**
	 * @param store The PURISTA StateStore instance to use for persistence.
	 */
	constructor(store: StateStore) {
		this.store = store
	}

	private getKey(sandboxId: string): string {
		return `${this.prefix}${sandboxId}`
	}

	private getOwnerIndexKey(owner: {
		organizationId: string
		projectId: string
		userId: string
		scope?: SandboxOwner['scope']
	}): string {
		return `${this.ownerPrefix}${owner.organizationId}:${owner.projectId}:${owner.userId}:${this.getScopeKeyPart(owner)}`
	}

	private getOwnerProvisionLockKey(owner: {
		organizationId: string
		projectId: string
		userId: string
		scope?: SandboxOwner['scope']
	}): string {
		return `${this.ownerProvisionLockPrefix}${owner.organizationId}:${owner.projectId}:${owner.userId}:${this.getScopeKeyPart(owner)}`
	}

	private getScopeKeyPart(owner: Pick<SandboxOwner, 'scope'>): string {
		if (!owner.scope || owner.scope.kind === 'shared-project-user') {
			return 'shared-project-user'
		}
		return `${owner.scope.kind}:${owner.scope.key}`
	}

	/**
	 * Registers a new sandbox in the persistent state store.
	 *
	 * @param metadata Full metadata of the sandbox to register.
	 */
	async register(metadata: SandboxMetadata): Promise<void> {
		const parsedMetadata = SandboxMetadataSchema.parse(metadata)
		await this.store.setState(this.getKey(parsedMetadata.sandboxId), parsedMetadata)
		await this.store.setState(this.getOwnerIndexKey(parsedMetadata), parsedMetadata.sandboxId)
	}

	/**
	 * Removes a sandbox from the registry.
	 *
	 * @param sandboxId Unique ID of the sandbox to unregister.
	 */
	async unregister(sandboxId: string): Promise<void> {
		const metadata = await this.getMetadata(sandboxId)
		await this.store.removeState(this.getKey(sandboxId))
		if (metadata) {
			const ownerKey = this.getOwnerIndexKey(metadata)
			const ownerEntry = await this.store.getState(ownerKey)
			if (ownerEntry[ownerKey] === sandboxId) {
				await this.store.removeState(ownerKey)
			}
		}
	}

	/**
	 * Retrieves metadata for a specific sandbox.
	 *
	 * @param sandboxId Unique ID of the sandbox.
	 * @returns Metadata object or undefined if not found or invalid.
	 */
	async getMetadata(sandboxId: string): Promise<SandboxMetadata | undefined> {
		const key = this.getKey(sandboxId)
		// getState expects a string array and returns an object mapping keys to values
		const data = await this.store.getState(key)
		const rawMetadata = data[key]

		if (!rawMetadata) return undefined

		const result = SandboxMetadataSchema.safeParse(rawMetadata)
		return result.success ? result.data : undefined
	}

	/**
	 * Returns metadata for an existing sandbox bound to the same owner tuple.
	 */
	async findByOwner(owner: {
		organizationId: string
		projectId: string
		userId: string
		scope?: SandboxOwner['scope']
	}): Promise<SandboxMetadata | undefined> {
		const ownerKey = this.getOwnerIndexKey(owner)
		const ownerEntry = await this.store.getState(ownerKey)
		const sandboxId = ownerEntry[ownerKey]
		if (typeof sandboxId !== 'string' || sandboxId.length < 1) {
			return undefined
		}
		const metadata = await this.getMetadata(sandboxId)
		if (!metadata) {
			await this.store.removeState(ownerKey)
			return undefined
		}
		if (
			metadata.organizationId !== owner.organizationId ||
			metadata.projectId !== owner.projectId ||
			metadata.userId !== owner.userId ||
			this.getScopeKeyPart(metadata) !== this.getScopeKeyPart(owner)
		) {
			await this.store.removeState(ownerKey)
			return undefined
		}
		return metadata
	}

	private parseProvisionLock(raw: unknown): { token: string; expiresAt: number } | undefined {
		if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
			return undefined
		}
		const token = (raw as { token?: unknown }).token
		const expiresAt = (raw as { expiresAt?: unknown }).expiresAt
		if (typeof token !== 'string' || typeof expiresAt !== 'number') {
			return undefined
		}
		return {
			token,
			expiresAt,
		}
	}

	private async acquireOwnerProvisionLock(
		owner: {
			organizationId: string
			projectId: string
			userId: string
			scope?: SandboxOwner['scope']
		},
		options: { lockTtlMs?: number; waitTimeoutMs?: number; pollIntervalMs?: number } = {},
	): Promise<{ lockKey: string; token: string }> {
		const lockTtlMs = options.lockTtlMs ?? 10_000
		const waitTimeoutMs = options.waitTimeoutMs ?? 15_000
		const pollIntervalMs = options.pollIntervalMs ?? 50
		const lockKey = this.getOwnerProvisionLockKey(owner)
		const startedAt = Date.now()
		const token = randomUUID()
		while (Date.now() - startedAt <= waitTimeoutMs) {
			const currentState = await this.store.getState(lockKey)
			const current = this.parseProvisionLock(currentState[lockKey])
			const now = Date.now()
			if (!current || current.expiresAt <= now) {
				await this.store.setState(lockKey, {
					token,
					expiresAt: now + lockTtlMs,
				})
				const verificationState = await this.store.getState(lockKey)
				const verification = this.parseProvisionLock(verificationState[lockKey])
				if (verification?.token === token) {
					return {
						lockKey,
						token,
					}
				}
			}
			await new Promise(resolve => setTimeout(resolve, pollIntervalMs))
		}
		throw new Error('Timed out acquiring sandbox owner provisioning lock')
	}

	private async releaseOwnerProvisionLock(lockKey: string, token: string): Promise<void> {
		const state = await this.store.getState(lockKey)
		const current = this.parseProvisionLock(state[lockKey])
		if (current?.token === token) {
			await this.store.removeState(lockKey)
		}
	}

	/**
	 * Runs owner-scoped provisioning work under a persistent lock.
	 */
	async withOwnerProvisionLock<T>(
		owner: {
			organizationId: string
			projectId: string
			userId: string
			scope?: SandboxOwner['scope']
		},
		fn: () => Promise<T>,
		options?: { lockTtlMs?: number; waitTimeoutMs?: number; pollIntervalMs?: number },
	): Promise<T> {
		const lock = await this.acquireOwnerProvisionLock(owner, options)
		try {
			return await fn()
		} finally {
			await this.releaseOwnerProvisionLock(lock.lockKey, lock.token)
		}
	}

	/**
	 * Reconciles a list of discovered sandboxes with the persistent registry.
	 * Discovered sandboxes that are missing from the registry are added.
	 *
	 * @param sandboxes List of sandboxes discovered by the driver (e.g., from Docker labels).
	 */
	async reconcile(sandboxes: Array<SandboxMetadata>): Promise<void> {
		for (const sandbox of sandboxes) {
			const parsed = SandboxMetadataSchema.safeParse(sandbox)
			if (!parsed.success) {
				continue
			}

			const existing = await this.getMetadata(parsed.data.sandboxId)
			if (!existing) {
				// Recovered from infrastructure metadata
				await this.register(parsed.data)
			}
		}
	}
}
