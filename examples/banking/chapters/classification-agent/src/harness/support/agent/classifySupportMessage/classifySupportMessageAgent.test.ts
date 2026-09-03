import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import { supportHarness } from '../../supportHarness.js'

describe('classifySupportMessageAgent', () => {
	it('runs the classification agent without PURISTA infrastructure', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: {
				category: 'account_access',
				urgency: 'urgent',
				reason: 'The customer is locked out before payroll closes.',
			},
			usage: { inputTokens: 12, outputTokens: 9, totalTokens: 21 },
			finishReason: 'stop',
		})
		const runtime = await supportHarness.getInstance({
			models: { primary: { provider, model: 'fake-classifier' } },
		})

		try {
			const session = await runtime.getSession('support-message:MSG-123')
			const outcome = await session.agents.classify_support_message.run({
				messageId: 'MSG-123',
				text: 'I cannot sign in and payroll closes in one hour.',
			})

			expect(outcome.status).toBe('completed')
			if (outcome.status !== 'completed') throw new Error('Expected a completed classification run.')
			expect(outcome.output).toEqual({
				category: 'account_access',
				urgency: 'urgent',
				reason: 'The customer is locked out before payroll closes.',
			})
			provider.assertExhausted()
		} finally {
			await runtime.shutdown()
		}
	})
})
