import { defineHarness } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import { planSupportResponseAgent } from './planSupportResponseAgent.js'

const usage = { inputTokens: 4, outputTokens: 3, totalTokens: 7 }

describe('planSupportResponseAgent', () => {
	it('returns a schema-validated response plan', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: { customerReply: 'We can help secure the card.', nextAction: 'freeze_card' },
			usage,
			finishReason: 'stop',
		})
		const definition = defineHarness({ name: 'response-agent-test' })
			.requireModel('response_model', { capabilities: ['object'] })
			.use(planSupportResponseAgent)
			.define()
		const runtime = await definition.getInstance({
			models: { response_model: { provider, model: 'response-fake' } },
		})

		try {
			const session = await runtime.getSession('response-case-1')
			await expect(
				session.agents.plan_support_response.run({ caseId: 'case-1', message: 'My card is missing.' }),
			).resolves.toMatchObject({ status: 'completed', output: { nextAction: 'freeze_card' } })
			provider.assertExhausted()
		} finally {
			await runtime.shutdown()
		}
	})
})
