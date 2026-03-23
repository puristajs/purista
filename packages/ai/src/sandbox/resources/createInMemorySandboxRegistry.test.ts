import { describe, expect, it } from 'vitest'

import { createInMemorySandboxRegistry } from './createInMemorySandboxRegistry.js'

describe('createInMemorySandboxRegistry', () => {
	it('creates a registry backed by an in-memory state store', async () => {
		const registry = createInMemorySandboxRegistry()

		await registry.register({
			sandboxId: 'sb-1',
			organizationId: 'org',
			projectId: 'proj',
			userId: 'user',
			containerName: 'purista-sb-1',
			createdAt: Date.now(),
		})

		const metadata = await registry.findByOwner({
			organizationId: 'org',
			projectId: 'proj',
			userId: 'user',
		})

		expect(metadata?.sandboxId).toBe('sb-1')
	})
})
