import { DefaultStateStore, type StoreBaseConfig } from '@purista/core'

import { SandboxRegistry } from './SandboxRegistry.js'

type CreateInMemorySandboxRegistryOptions = {
	stateStoreConfig?: StoreBaseConfig<Record<string, unknown>>
}

/**
 * Creates a SandboxRegistry backed by PURISTA's in-memory DefaultStateStore.
 *
 * This is intended for local development, tests, and single-process apps that
 * want sandbox lifecycle support without wiring a separate persistent store.
 */
export const createInMemorySandboxRegistry = (options?: CreateInMemorySandboxRegistryOptions) =>
	new SandboxRegistry(
		new DefaultStateStore({
			...options?.stateStoreConfig,
		}),
	)
