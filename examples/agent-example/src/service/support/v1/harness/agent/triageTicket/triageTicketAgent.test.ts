import { defineHarness } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'

import { triageTicketAgent } from './triageTicketAgent.js'

describe('triageTicketAgent', () => {
	it('runs as a portable definition with a structured prompt and no credentials', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: { priority: 'high', reason: 'The customer cannot sign in before payroll closes.' },
			usage: { inputTokens: 8, outputTokens: 6, totalTokens: 14 },
			finishReason: 'stop',
		})
		const runtime = await defineHarness({ name: 'triageTicketTest' })
			.addAgent(triageTicketAgent)
			.getInstance({ model: { provider, model: 'fake' } })

		try {
			const session = await runtime.getSession('ticket:SUP-123')
			const outcome = await session.agents.triageTicket.run({
				ticketId: 'SUP-123',
				text: 'I cannot sign in and payroll closes today.',
			})
			expect(outcome).toMatchObject({
				status: 'completed',
				output: {
					priority: 'high',
					reason: 'The customer cannot sign in before payroll closes.',
				},
			})
			expect(provider.requests[0]?.messages.at(-1)).toEqual({
				role: 'user',
				content: 'Ticket SUP-123: I cannot sign in and payroll closes today.',
			})
			provider.assertExhausted()
		} finally {
			await runtime.close()
		}
	})
})
