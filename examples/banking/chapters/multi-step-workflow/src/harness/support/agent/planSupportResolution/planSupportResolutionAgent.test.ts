import { defineHarness } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import { planSupportResolutionAgent } from './planSupportResolutionAgent.js'

const usage = { inputTokens: 4, outputTokens: 3, totalTokens: 7 }

describe('planSupportResolutionAgent', () => {
	it('returns a schema-validated resolution plan', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: { summary: 'Verify the caller and secure the card.', nextAction: 'freeze_card' },
			usage,
			finishReason: 'stop',
		})
		const definition = defineHarness({ name: 'resolution-agent-test' })
			.requireModel('resolution_model', { capabilities: ['object'] })
			.use(planSupportResolutionAgent)
			.define()
		const runtime = await definition.getInstance({
			models: { resolution_model: { provider, model: 'resolution-fake' } },
		})

		try {
			const session = await runtime.getSession('resolution-case-1')
			await expect(
				session.agents.plan_support_resolution.run({
					caseId: 'case-1',
					message: 'My card is missing.',
					classification: { category: 'card', urgency: 'urgent' },
				}),
			).resolves.toMatchObject({ status: 'completed', output: { nextAction: 'freeze_card' } })
			provider.assertExhausted()
		} finally {
			await runtime.shutdown()
		}
	})
})
