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

	it('encodes buffer writes as base64 payloads', async () => {
		const invoke = vi.fn().mockResolvedValue(undefined)
		const eventBridge = { invoke } as unknown as EventBridge
		const adapter = createPuristaSandboxAdapter(eventBridge, {
			sandboxId: 'sb-1',
			tenantId: 'tenant-1',
			principalId: 'user-1',
		})

		await adapter.writeFiles([
			{ path: '/tmp/a.txt', content: 'hello' },
			{ path: '/tmp/b.bin', content: Buffer.from([0, 1, 2]) },
		])

		expect(invoke).toHaveBeenCalledWith(
			expect.objectContaining({
				payload: {
					payload: {
						sandboxId: 'sb-1',
						files: {
							'/tmp/a.txt': { encoding: 'utf-8', content: 'hello' },
							'/tmp/b.bin': { encoding: 'base64', content: Buffer.from([0, 1, 2]).toString('base64') },
						},
					},
					parameter: {},
				},
			}),
		)
	})
})
