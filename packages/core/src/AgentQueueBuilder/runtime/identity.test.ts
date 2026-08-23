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
	it('isolates one logical conversation id by trusted tenant metadata when present', () => {
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

		expect(first.harnessSessionId).toContain(':tenant:value-tenant-a:principal:default:conversation:shared')
		expect(second.harnessSessionId).toContain(':tenant:value-tenant-b:principal:default:conversation:shared')
		expect(first.harnessSessionId).not.toBe(second.harnessSessionId)
	})

	it('isolates one logical conversation id by trusted principal metadata when present', () => {
		const first = deriveAgentRunIdentity({
			manifest,
			message: { id: 'message-a', tenantId: 'tenant-a', principalId: 'principal-a' },
			payload: { conversationId: 'shared' },
		})
		const second = deriveAgentRunIdentity({
			manifest,
			message: { id: 'message-b', tenantId: 'tenant-a', principalId: 'principal-b' },
			payload: { conversationId: 'shared' },
		})

		expect(first.harnessSessionId).toContain(':tenant:value-tenant-a:principal:value-principal-a:conversation:shared')
		expect(second.harnessSessionId).toContain(':tenant:value-tenant-a:principal:value-principal-b:conversation:shared')
		expect(first.harnessSessionId).not.toBe(second.harnessSessionId)
	})

	it('uses the conversation id alone when tenant and principal metadata are omitted', () => {
		const identity = deriveAgentRunIdentity({
			manifest,
			message: { id: 'message' },
			payload: { conversationId: 'shared:value' },
		})

		expect(identity.tenantId).toBeUndefined()
		expect(identity.principalId).toBeUndefined()
		expect(identity.harnessSessionId).toBe('agent:support:1:triage:conversation:shared:value')
		expect(resolveHarnessSessionId(manifest, 'message', { conversationId: 'shared:value' })).toBe(
			identity.harnessSessionId,
		)
	})

	it('does not collide a defaulted dimension with the literal value "default"', () => {
		const defaulted = resolveHarnessSessionId(manifest, 'message-a', { conversationId: 'shared' })
		const literal = resolveHarnessSessionId(manifest, 'message-b', { conversationId: 'shared' }, 'default', 'default')

		expect(defaulted).not.toBe(literal)
		expect(literal).toContain(':tenant:value-default:principal:value-default:conversation:shared')
	})

	it('uses a collision-safe default when only one optional dimension is omitted', () => {
		const defaulted = resolveHarnessSessionId(manifest, 'message-a', { conversationId: 'shared' }, 'tenant-a')
		const literal = resolveHarnessSessionId(manifest, 'message-b', { conversationId: 'shared' }, 'tenant-a', 'default')

		expect(defaulted).not.toBe(literal)
		expect(defaulted).toContain(':tenant:value-tenant-a:principal:default:conversation:shared')
	})
})
