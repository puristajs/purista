import { defineHarness } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import { assessSupportRiskAgent } from './assessSupportRiskAgent.js'

const usage = { inputTokens: 4, outputTokens: 3, totalTokens: 7 }

describe('assessSupportRiskAgent', () => {
	it('returns a schema-validated risk assessment', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: { level: 'high', evidence: ['The customer reports a missing card.'] },
			usage,
			finishReason: 'stop',
		})
		const definition = defineHarness({ name: 'risk-agent-test' })
			.requireModel('risk_model', { capabilities: ['object'] })
			.use(assessSupportRiskAgent)
			.define()
		const runtime = await definition.getInstance({ models: { risk_model: { provider, model: 'risk-fake' } } })

		try {
			const session = await runtime.getSession('risk-case-1')
			await expect(
				session.agents.assess_support_risk.run({ caseId: 'case-1', message: 'My card is missing.' }),
			).resolves.toMatchObject({ status: 'completed', output: { level: 'high' } })
			provider.assertExhausted()
		} finally {
			await runtime.shutdown()
		}
	})
})
