import { describe, expect, it } from 'vitest'

import { deriveAgentRunIdentity, resolveHarnessSessionId } from './identity.js'

const manifest = {
	serviceName: 'support',
	serviceVersion: '1',
	agentName: 'triage',
	runtimeRevision: 'rev-test',
	session: { mode: 'conversation' as const, payloadPath: ['conversationId'], scope: 'tenant' as const },
}

describe('attached-agent harness session identity', () => {
	it('isolates a shared logical conversation id by its required tenant scope', () => {
		const first = deriveAgentRunIdentity({
			manifest,
			message: { id: 'message-a', tenantId: 'tenant-a' },
			payload: { conversationId: 'shared' },
		})
		const second = deriveAgentRunIdentity({
			manifest,
			message: { id: 'message-b', tenantId: 'tenant-b' },
			payload: { conversationId: 'shared' },
		})

		expect(first.harnessSessionId).toContain(':tenant:tenant-a:conversation:shared')
		expect(second.harnessSessionId).toContain(':tenant:tenant-b:conversation:shared')
		expect(first.harnessSessionId).not.toBe(second.harnessSessionId)
	})

	it('fails closed when a tenant-scoped conversation has no message tenant', () => {
		expect(() => resolveHarnessSessionId(manifest, 'message', { conversationId: 'shared' })).toThrow('message.tenantId')
	})

	it('uses a service-scoped conversation without fabricating tenant identity', () => {
		const identity = deriveAgentRunIdentity({
			manifest: { ...manifest, session: { mode: 'conversation', payloadPath: ['conversationId'], scope: 'service' } },
			message: { id: 'message' },
			payload: { conversationId: 'shared:value' },
		})

		expect(identity.tenantId).toBeUndefined()
		expect(identity.harnessSessionId).toContain(':service:conversation:shared%3Avalue')
	})

	it('keeps message tenant metadata without partitioning a service-scoped conversation', () => {
		const identity = deriveAgentRunIdentity({
			manifest: { ...manifest, session: { mode: 'conversation', payloadPath: ['conversationId'], scope: 'service' } },
			message: { id: 'message', tenantId: 'tenant-a' },
			payload: { conversationId: 'shared:value' },
		})

		expect(identity.tenantId).toBe('tenant-a')
		expect(identity.harnessSessionId).toContain(':service:conversation:shared%3Avalue')
		expect(identity.harnessSessionId).not.toContain('tenant-a')
	})
})
