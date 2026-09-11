import { defineHarness } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import { classifySupportMessageAgent } from './classifySupportMessageAgent.js'

describe('classifySupportMessageAgent', () => {
	it('returns a schema-validated classification with a deterministic model', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: { category: 'card', urgency: 'urgent', reason: 'The card was stolen and is being used.' },
			usage: { inputTokens: 8, outputTokens: 5, totalTokens: 13 },
			finishReason: 'stop',
		})
		const runtime = await defineHarness({ name: 'classificationEvaluationTest' })
			.addAgent(classifySupportMessageAgent)
			.getInstance({ models: { classification: { provider, model: 'classification-fake' } } })

		try {
			const session = await runtime.getSession('classification-message-1')
			try {
				await expect(
					session.agents.classifySupportMessage.run({
						messageId: 'message-1',
						text: 'My card was stolen and someone is using it now.',
					}),
				).resolves.toMatchObject({ status: 'completed', output: { category: 'card', urgency: 'urgent' } })
				provider.assertExhausted()
			} finally {
				await session.release()
			}
		} finally {
			await runtime.close()
		}
	})
})
