import { defineHarness } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import { planSupportResponseAgent } from './planSupportResponseAgent.js'

describe('planSupportResponseAgent', () => {
	it('runs as a portable agent with the named response model', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: { customerReply: 'We can help secure the card.', nextAction: 'freeze_card' },
			usage: { inputTokens: 4, outputTokens: 3, totalTokens: 7 },
			finishReason: 'stop',
		})
		const runtime = await defineHarness({ name: 'responseAgentTest' })
			.addAgent(planSupportResponseAgent)
			.getInstance({ models: { responseModel: { provider, model: 'response-fake' } } })
		const session = await runtime.getSession('response-case-1')

		try {
			const outcome = await session.agents.planSupportResponse.run({
				caseId: 'case-1',
				message: 'My card is missing.',
			})
			expect(outcome.status).toBe('completed')
			if (outcome.status !== 'completed') throw new Error('Expected a completed response plan.')
			expect(outcome.output).toEqual({
				customerReply: 'We can help secure the card.',
				nextAction: 'freeze_card',
			})
			expect(provider.requests).toHaveLength(1)
			provider.assertExhausted()
		} finally {
			await session.release()
			await runtime.close()
		}
	})
})
