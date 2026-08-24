import { describe, expect, it } from 'vitest'
import type { AgentManifest } from '../types.js'
import { deriveAgentRunIdentity } from './identity.js'

const manifest = {
	serviceName: 'Payments',
	serviceVersion: '1',
	agentName: 'reviewPayment',
	runtimeRevision: 'revision-1',
	session: { mode: 'ephemeral' },
	durability: { mode: 'required', runIdPath: ['review', 'runId'] },
} as const satisfies Pick<
	AgentManifest,
	'agentName' | 'runtimeRevision' | 'serviceName' | 'serviceVersion' | 'session' | 'durability'
>

describe('durable agent run identity', () => {
	it('reuses one namespaced run id across different queue deliveries', () => {
		const first = deriveAgentRunIdentity({ manifest, message: { id: 'delivery-1' }, payload: { review: { runId: 'logical-42' } } })
		const second = deriveAgentRunIdentity({ manifest, message: { id: 'delivery-2' }, payload: { review: { runId: 'logical-42' } } })

		expect(first.transportMessageId).not.toBe(second.transportMessageId)
		expect(first.runId).toBe(second.runId)
		expect(first.runId).toMatch(/^agent-run:[0-9a-f]{64}$/)
	})

	it('fails before execution when runIdPath does not resolve', () => {
		expect(() => deriveAgentRunIdentity({ manifest, message: { id: 'delivery-1' }, payload: { review: {} } }))
			.toThrow('Agent durability run id path "review.runId" must resolve to a non-empty string')
	})
})
