import type { StateStore } from '@purista/core'
import { type SandboxMetadata, SandboxMetadataSchema } from '../types/SandboxDriver.js'

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

	/**
	 * @param store The PURISTA StateStore instance to use for persistence.
	 */
	constructor(store: StateStore) {
		this.store = store
	}

	private getKey(sandboxId: string): string {
		return `${this.prefix}${sandboxId}`
	}

	/**
	 * Registers a new sandbox in the persistent state store.
	 *
	 * @param metadata Full metadata of the sandbox to register.
	 */
	async register(metadata: SandboxMetadata): Promise<void> {
		await this.store.setState(this.getKey(metadata.sandboxId), metadata)
	}

	/**
	 * Removes a sandbox from the registry.
	 *
	 * @param sandboxId Unique ID of the sandbox to unregister.
	 */
	async unregister(sandboxId: string): Promise<void> {
		await this.store.removeState(this.getKey(sandboxId))
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
	 * Reconciles a list of discovered sandboxes with the persistent registry.
	 * Discovered sandboxes that are missing from the registry are added.
	 *
	 * @param sandboxes List of sandboxes discovered by the driver (e.g., from Docker labels).
	 */
	async reconcile(sandboxes: Array<SandboxMetadata>): Promise<void> {
		for (const sandbox of sandboxes) {
			const existing = await this.getMetadata(sandbox.sandboxId)
			if (!existing) {
				// Recovered from infrastructure metadata
				await this.register(sandbox)
			}
		}
	}
}
