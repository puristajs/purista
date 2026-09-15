import { defineHarness } from '@purista/harness'
import { FakeModelProvider, objectReply } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import { planSupportResolutionAgent } from './planSupportResolutionAgent.js'

const usage = { inputTokens: 4, outputTokens: 3, totalTokens: 7 }

describe('planSupportResolutionAgent', () => {
	it('returns a schema-validated resolution plan', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject(
			objectReply(
				{ summary: 'Verify the caller and secure the card.', nextAction: 'freeze_card' },
				{ usage, finishReason: 'stop' },
			),
		)
		const runtime = await defineHarness({ name: 'resolutionAgentTest' })
			.addAgent(planSupportResolutionAgent)
			.getInstance({ models: { planning: { provider, model: 'resolution-fake' } } })
		const session = await runtime.getSession('resolution-case-1')
		try {
			const outcome = await session.agents.planSupportResolution.run({
				caseId: 'case-1',
				message: 'My card is missing.',
				classification: { category: 'card', urgency: 'urgent' },
				handlingLane: 'priority',
			})
			expect(outcome.status).toBe('completed')
			expect(outcome.output.nextAction).toBe('freeze_card')
			provider.assertExhausted()
		} finally {
			await session.release()
			await runtime.close()
		}
	})
})
