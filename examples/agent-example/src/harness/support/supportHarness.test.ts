import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'

import { supportHarness } from './supportHarness.js'

describe('supportHarness', () => {
	it('runs the same native agent definition without PURISTA', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: { priority: 'high', reason: 'The customer cannot sign in before payroll closes.' },
			usage: { inputTokens: 8, outputTokens: 6, totalTokens: 14 },
			finishReason: 'stop',
		})
		const runtime = await supportHarness.getInstance({
			models: { primary: { provider, model: 'fake' } },
			hostTools: {
				get_incident_snapshot: async () => {
					throw new Error('The triage agent must not call incident tools.')
				},
				get_runbook: async () => {
					throw new Error('The triage agent must not call incident tools.')
				},
			},
		})

		try {
			const session = await runtime.getSession('ticket:SUP-123')
			const outcome = await session.agents.triage_ticket.run({
				ticketId: 'SUP-123',
				text: 'I cannot sign in and payroll closes today.',
			})
			expect(outcome.status).toBe('completed')
			if (outcome.status !== 'completed') throw new Error('Expected a completed triage run.')
			expect(outcome.output).toEqual({
				priority: 'high',
				reason: 'The customer cannot sign in before payroll closes.',
			})
			provider.assertExhausted()
		} finally {
			await runtime.shutdown()
		}
	})
})
