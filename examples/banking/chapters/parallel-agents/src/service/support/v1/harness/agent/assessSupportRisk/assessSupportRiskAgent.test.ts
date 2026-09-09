import { defineHarness } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import { assessSupportRiskAgent } from './assessSupportRiskAgent.js'

describe('assessSupportRiskAgent', () => {
	it('runs as a portable agent with the named risk model', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: { level: 'high', evidence: ['The customer reports a missing card.'] },
			usage: { inputTokens: 4, outputTokens: 3, totalTokens: 7 },
			finishReason: 'stop',
		})
		const runtime = await defineHarness({ name: 'riskAgentTest' })
			.addAgent(assessSupportRiskAgent)
			.getInstance({ models: { riskModel: { provider, model: 'risk-fake' } } })
		const session = await runtime.getSession('risk-case-1')

		try {
			const outcome = await session.agents.assessSupportRisk.run({
				caseId: 'case-1',
				message: 'My card is missing.',
			})
			expect(outcome.status).toBe('completed')
			if (outcome.status !== 'completed') throw new Error('Expected a completed risk assessment.')
			expect(outcome.output).toEqual({
				level: 'high',
				evidence: ['The customer reports a missing card.'],
			})
			expect(provider.requests).toHaveLength(1)
			provider.assertExhausted()
		} finally {
			await session.release()
			await runtime.close()
		}
	})
})
