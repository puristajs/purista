import { defineHarness } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import { classifySupportCaseAgent } from './classifySupportCaseAgent.js'

const usage = { inputTokens: 4, outputTokens: 3, totalTokens: 7 }

describe('classifySupportCaseAgent', () => {
	it('returns a schema-validated classification', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({ object: { category: 'card', urgency: 'urgent' }, usage, finishReason: 'stop' })
		const runtime = await defineHarness({ name: 'classificationAgentTest' })
			.addAgent(classifySupportCaseAgent)
			.getInstance({ models: { classificationModel: { provider, model: 'classification-fake' } } })
		const session = await runtime.getSession('classification-case-1')
		try {
			const outcome = await session.agents.classifySupportCase.run({ caseId: 'case-1', message: 'My card is missing.' })
			expect(outcome.status).toBe('completed')
			if (outcome.status !== 'completed') throw new Error('Expected a completed classification.')
			expect(outcome.output).toEqual({ category: 'card', urgency: 'urgent' })
			provider.assertExhausted()
		} finally {
			await session.release()
			await runtime.close()
		}
	})
})
