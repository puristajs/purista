import { DefaultStateStore } from '@purista/core'
import { afterEach, describe, expect, it } from 'vitest'
import type { SandboxMetadata } from '../types/SandboxDriver.js'
import { SandboxRegistry } from './SandboxRegistry.js'

describe('SandboxRegistry', () => {
	const store = new DefaultStateStore({ enableGet: true, enableSet: true, enableRemove: true, config: {} })
	afterEach(async () => {
		await store.removeState('sandbox:registry:sb-1')
		await store.removeState('sandbox:owner:org:proj:user')
		await store.removeState('sandbox:owner:org:proj:user:shared-project-user')
		await store.removeState('sandbox:owner:org:proj:user:agent-run:run-1')
		await store.removeState('sandbox:owner:org:proj:user:agent-run:run-2')
		await store.removeState('sandbox:owner-lock:org:proj:user:shared-project-user')
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

	it('isolates registry lookup by optional scope', async () => {
		const registry = new SandboxRegistry(store)
		await registry.register({
			sandboxId: 'sb-1',
			organizationId: 'org',
			projectId: 'proj',
			userId: 'user',
			scope: { kind: 'agent-run', key: 'run-1' },
			containerName: 'purista-sb-1',
			createdAt: Date.now(),
		})
		const matching = await registry.findByOwner({
			organizationId: 'org',
			projectId: 'proj',
			userId: 'user',
			scope: { kind: 'agent-run', key: 'run-1' },
		})
		const different = await registry.findByOwner({
			organizationId: 'org',
			projectId: 'proj',
			userId: 'user',
			scope: { kind: 'agent-run', key: 'run-2' },
		})
		expect(matching?.sandboxId).toBe('sb-1')
		expect(different).toBeUndefined()
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

	it('rejects invalid metadata on register', async () => {
		const registry = new SandboxRegistry(store)

		const invalidMetadata = {
			sandboxId: '',
			organizationId: 'org',
			projectId: 'proj',
			userId: 'user',
			containerName: 'purista-sb-1',
			createdAt: Date.now(),
		} as unknown as SandboxMetadata
		await expect(registry.register(invalidMetadata)).rejects.toThrow()
	})

	it('cleans stale owner index entries pointing to mismatched metadata', async () => {
		const registry = new SandboxRegistry(store)
		await store.setState('sandbox:owner:org:proj:user:shared-project-user', 'sb-1')
		await store.setState('sandbox:registry:sb-1', {
			sandboxId: 'sb-1',
			organizationId: 'other-org',
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

		expect(result).toBeUndefined()
		expect(
			(await store.getState('sandbox:owner:org:proj:user:shared-project-user'))[
				'sandbox:owner:org:proj:user:shared-project-user'
			],
		).toBeUndefined()
	})

	it('skips incomplete recovered sandboxes during reconcile', async () => {
		const registry = new SandboxRegistry(store)

		const recovered = {
			sandboxId: 'sb-1',
			organizationId: '',
			projectId: 'proj',
			userId: 'user',
			containerName: 'purista-sb-1',
			createdAt: Date.now(),
		} as unknown as SandboxMetadata
		await registry.reconcile([recovered])

		expect(await registry.getMetadata('sb-1')).toBeUndefined()
	})

	it('serializes owner-scoped provisioning callbacks with a lock', async () => {
		const registry = new SandboxRegistry(store)
		const owner = {
			organizationId: 'org',
			projectId: 'proj',
			userId: 'user',
		}
		const order: string[] = []
		let running = 0
		let maxConcurrent = 0

		const runSection = async (name: 'a' | 'b', waitMs = 0) => {
			order.push(`${name}-start`)
			running += 1
			maxConcurrent = Math.max(maxConcurrent, running)
			if (waitMs > 0) {
				await new Promise(resolve => setTimeout(resolve, waitMs))
			}
			running -= 1
			order.push(`${name}-end`)
		}

		await Promise.all([
			registry.withOwnerProvisionLock(owner, async () => runSection('a', 20)),
			registry.withOwnerProvisionLock(owner, async () => runSection('b')),
		])
		expect(maxConcurrent).toBe(1)
		expect(order).toHaveLength(4)
		expect(order.filter(entry => entry === 'a-start')).toHaveLength(1)
		expect(order.filter(entry => entry === 'a-end')).toHaveLength(1)
		expect(order.filter(entry => entry === 'b-start')).toHaveLength(1)
		expect(order.filter(entry => entry === 'b-end')).toHaveLength(1)
		expect(order[0]).toMatch(/^[ab]-start$/)
		expect(order[1]).toMatch(/^[ab]-end$/)
		expect(order[2]).toMatch(/^[ab]-start$/)
		expect(order[3]).toMatch(/^[ab]-end$/)
		expect(order[0].charAt(0)).not.toBe(order[2].charAt(0))
	})
})
