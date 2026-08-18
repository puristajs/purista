import { describe, expect, it } from 'vitest'

import { deriveAgentRunIdentity, resolveHarnessSessionId } from './identity.js'

const manifest = {
	serviceName: 'support',
	serviceVersion: '1',
	agentName: 'triage',
	runtimeRevision: 'rev-test',
	session: { mode: 'conversation' as const, payloadPath: ['conversationId'] },
}

describe('attached-agent harness session identity', () => {
	it('isolates a shared logical conversation id by tenant by default', () => {
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

	it('requires tenant identity for the default conversation scope', () => {
		expect(() => resolveHarnessSessionId(manifest, 'message', { conversationId: 'shared' })).toThrow('message.tenantId')
	})

	it('uses an explicit service single-tenant identity when legacy messages omit tenant metadata', () => {
		const identity = deriveAgentRunIdentity({
			manifest,
			message: { id: 'message' },
			payload: { conversationId: 'shared' },
			singleTenantId: 'acme',
		})

		expect(identity.tenantId).toBe('acme')
		expect(identity.harnessSessionId).toContain(':tenant:acme:conversation:shared')
	})

	it('rejects a message tenant that conflicts with the configured single-tenant identity', () => {
		expect(() =>
			deriveAgentRunIdentity({
				manifest,
				message: { id: 'message', tenantId: 'other-tenant' },
				payload: { conversationId: 'shared' },
				singleTenantId: 'acme',
			}),
		).toThrow('must match ai.tenancy.singleTenantId')
	})

	it('permits an explicit global scope for a deliberately single-tenant conversation', () => {
		const sessionId = resolveHarnessSessionId(
			{ ...manifest, session: { mode: 'conversation', payloadPath: ['conversationId'], scope: 'global' } },
			'message',
			{ conversationId: 'shared:value' },
		)

		expect(sessionId).toContain(':global:conversation:shared%3Avalue')
	})
})
