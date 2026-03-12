import { DefaultStateStore } from '@purista/core'
import { afterEach, describe, expect, it } from 'vitest'
import { SandboxRegistry } from './SandboxRegistry.js'

describe('SandboxRegistry', () => {
	const store = new DefaultStateStore({ enableGet: true, enableSet: true, enableRemove: true, config: {} })
	afterEach(async () => {
		await store.removeState('sandbox:registry:sb-1')
		await store.removeState('sandbox:owner:org:proj:user')
	})

	it('registers and retrieves metadata', async () => {
		const registry = new SandboxRegistry(store)
		await registry.register({
			sandboxId: 'sb-1',
			organizationId: 'org',
			projectId: 'proj',
			userId: 'user',
			containerName: 'purista-sb-1',
			createdAt: Date.now(),
		})
		const result = await registry.getMetadata('sb-1')
		expect(result?.sandboxId).toBe('sb-1')
	})

	it('finds metadata by owner tuple', async () => {
		const registry = new SandboxRegistry(store)
		await registry.register({
			sandboxId: 'sb-1',
			organizationId: 'org',
			projectId: 'proj',
			userId: 'user',
			containerName: 'purista-sb-1',
			createdAt: Date.now(),
		})
		const result = await registry.findByOwner({
			organizationId: 'org',
			projectId: 'proj',
			userId: 'user',
		})
		expect(result?.sandboxId).toBe('sb-1')
	})

	it('cleans owner index on unregister', async () => {
		const registry = new SandboxRegistry(store)
		await registry.register({
			sandboxId: 'sb-1',
			organizationId: 'org',
			projectId: 'proj',
			userId: 'user',
			containerName: 'purista-sb-1',
			createdAt: Date.now(),
		})
		await registry.unregister('sb-1')
		const result = await registry.findByOwner({
			organizationId: 'org',
			projectId: 'proj',
			userId: 'user',
		})
		expect(result).toBeUndefined()
	})
})
