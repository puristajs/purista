import type { ContextBase, EBMessage } from '@purista/core'
import { describe, expect, it } from 'vitest'

import { runAgentWithProtocol } from './purista.js'

const context = {
	logger: { error: () => undefined },
	startActiveSpan: async () => undefined,
	message: {
		id: 'msg-1',
		correlationId: 'corr-1',
		sender: {
			serviceName: 'demo',
			serviceVersion: 'v1',
			serviceTarget: 'agent',
			instanceId: 'demo-1',
		},
		principalId: 'user-1',
		tenantId: 'tenant-1',
	} as EBMessage,
} as unknown as ContextBase & { message: EBMessage }

describe('runAgentWithProtocol', () => {
	it('emits message and telemetry frames on success', async () => {
		const envelopes = await runAgentWithProtocol(context, async () => ({
			output: 'hi',
			tokens: { prompt: 10, completion: 5 },
			durationMs: 42,
		}))

		expect(envelopes).toHaveLength(2)
		expect(envelopes[0]?.frame.kind).toBe('message')
		expect(envelopes[1]?.frame.kind).toBe('telemetry')
	})

	it('emits error frame when runner throws', async () => {
		const envelopes = await runAgentWithProtocol(context, async () => {
			throw new Error('failure')
		})

		expect(envelopes).toHaveLength(1)
		expect(envelopes[0]?.frame.kind).toBe('error')
	})
})
