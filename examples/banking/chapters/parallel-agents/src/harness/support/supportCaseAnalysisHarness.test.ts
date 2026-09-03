import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import { supportCaseAnalysisHarness } from './supportCaseAnalysisHarness.js'

const usage = { inputTokens: 8, outputTokens: 5, totalTokens: 13 }

describe('supportCaseAnalysisHarness', () => {
	it('runs both specialists and merges their typed results', async () => {
		const riskProvider = new FakeModelProvider({ strict: true })
		const responseProvider = new FakeModelProvider({ strict: true })
		riskProvider.enqueueObject({
			object: { level: 'high', evidence: ['The customer reports a missing card.'] },
			usage,
			finishReason: 'stop',
		})
		responseProvider.enqueueObject({
			object: { customerReply: 'We can help secure the card.', nextAction: 'freeze_card' },
			usage,
			finishReason: 'stop',
		})
		const runtime = await supportCaseAnalysisHarness.getInstance({
			models: {
				risk_model: { provider: riskProvider, model: 'risk-fake' },
				response_model: { provider: responseProvider, model: 'response-fake' },
			},
		})

		try {
			const session = await runtime.getSession('case-1')
			const outcome = await session.workflows.analyze_support_case.run({
				caseId: 'case-1',
				message: 'My card is missing.',
			})
			expect(outcome).toMatchObject({
				status: 'completed',
				output: {
					caseId: 'case-1',
					risk: { level: 'high' },
					response: { nextAction: 'freeze_card' },
				},
			})
			riskProvider.assertExhausted()
			responseProvider.assertExhausted()
		} finally {
			await runtime.shutdown()
		}
	})
})
