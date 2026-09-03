import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import { supportHarness } from '../../supportHarness.js'

describe('classifySupportMessageAgent', () => {
	it('returns a schema-validated classification', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: { category: 'card', urgency: 'urgent', reason: 'The card is stolen and active misuse is reported.' },
			usage: { inputTokens: 8, outputTokens: 5, totalTokens: 13 },
			finishReason: 'stop',
		})
		const runtime = await supportHarness.getInstance({
			models: { primary: { provider, model: 'classification-fake' } },
		})

		try {
			const session = await runtime.getSession('classification-message-1')
			await expect(
				session.agents.classify_support_message.run({
					messageId: 'message-1',
					text: 'My card was stolen and someone is using it now.',
				}),
			).resolves.toMatchObject({ status: 'completed', output: { category: 'card', urgency: 'urgent' } })
			provider.assertExhausted()
		} finally {
			await runtime.shutdown()
		}
	})
})
