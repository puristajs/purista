import { defineHarness } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import { classifySupportCaseAgent } from './classifySupportCaseAgent.js'

const usage = { inputTokens: 4, outputTokens: 3, totalTokens: 7 }

describe('classifySupportCaseAgent', () => {
	it('returns a schema-validated classification', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: { category: 'card', urgency: 'urgent' },
			usage,
			finishReason: 'stop',
		})
		const definition = defineHarness({ name: 'classification-agent-test' })
			.requireModel('classification_model', { capabilities: ['object'] })
			.use(classifySupportCaseAgent)
			.define()
		const runtime = await definition.getInstance({
			models: { classification_model: { provider, model: 'classification-fake' } },
		})

		try {
			const session = await runtime.getSession('classification-case-1')
			await expect(
				session.agents.classify_support_case.run({ caseId: 'case-1', message: 'My card is missing.' }),
			).resolves.toMatchObject({ status: 'completed', output: { category: 'card', urgency: 'urgent' } })
			provider.assertExhausted()
		} finally {
			await runtime.shutdown()
		}
	})
})
