import { defineHarness } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import { classifySupportMessageAgent } from './classifySupportMessageAgent.js'

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
		const runtime = await defineHarness({ name: 'classificationTest' })
			.addAgent(classifySupportMessageAgent)
			.getInstance({ models: { classification: { provider, model: 'fake-classifier' } } })

		try {
			const session = await runtime.getSession('support-message:MSG-123')
			try {
				const outcome = await session.agents.classifySupportMessage.run({
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
				const request = provider.requests[0]
				expect(request && 'messages' in request ? request.messages.at(-1) : undefined).toEqual({
					role: 'user',
					content: 'Message MSG-123: I cannot sign in and payroll closes in one hour.',
				})
				provider.assertExhausted()
			} finally {
				await session.release()
			}
		} finally {
			await runtime.close()
		}
	})
})
