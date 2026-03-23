import type { EventBridge } from '@purista/core'
import { describe, expect, it, vi } from 'vitest'
import { createPuristaSandboxAdapter } from './createPuristaSandboxAdapter.js'

describe('createPuristaSandboxAdapter', () => {
	it('forwards sandbox operations with caller identity metadata', async () => {
		const invoke = vi.fn().mockResolvedValue({ stdout: '', stderr: '', exitCode: 0 })
		const eventBridge = { invoke } as unknown as EventBridge

		const adapter = createPuristaSandboxAdapter(eventBridge, {
			sandboxId: 'sb-1',
			tenantId: 'tenant-1',
			principalId: 'user-1',
		})

		await adapter.executeCommand('pwd')

		expect(invoke).toHaveBeenCalledWith(
			expect.objectContaining({
				tenantId: 'tenant-1',
				principalId: 'user-1',
				payload: {
					payload: { sandboxId: 'sb-1', command: 'pwd' },
					parameter: {},
				},
			}),
		)
	})
})
