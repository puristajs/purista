import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import { assertClassificationGate } from './changeGate.js'
import { runClassificationEvaluation } from './runClassificationEvaluation.js'

const usage = { inputTokens: 8, outputTokens: 5, totalTokens: 13 }

describe('classification agent evaluation', () => {
	it('runs the versioned dataset and passes the deterministic change gate', async () => {
		const provider = new FakeModelProvider({ strict: true })
		for (const object of [
			{ category: 'card', urgency: 'urgent', reason: 'The card is stolen and active misuse is reported.' },
			{ category: 'transfer', urgency: 'normal', reason: 'The question concerns a scheduled transfer date.' },
			{ category: 'account_access', urgency: 'urgent', reason: 'Essential access is blocked before a deadline.' },
		]) {
			provider.enqueueObject({ object, usage, finishReason: 'stop' })
		}
		const result = await runClassificationEvaluation(provider)
		expect(assertClassificationGate(result)).toEqual({ categoryRate: 1, urgencyRate: 1 })
		expect(result.cases).toHaveLength(3)
		expect(result.dimensionAggregates).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ dimensionId: 'category_exact' }),
				expect.objectContaining({ dimensionId: 'urgency_exact' }),
			]),
		)
		provider.assertExhausted()
	})

	it('fails the gate when a candidate regresses', async () => {
		const provider = new FakeModelProvider({ strict: true })
		for (const object of [
			{ category: 'other', urgency: 'normal', reason: 'Incorrect fixture.' },
			{ category: 'transfer', urgency: 'normal', reason: 'Correct fixture.' },
			{ category: 'account_access', urgency: 'urgent', reason: 'Correct fixture.' },
		]) {
			provider.enqueueObject({ object, usage, finishReason: 'stop' })
		}
		const result = await runClassificationEvaluation(provider, { runId: 'support-classification-eval-regression' })
		expect(() => assertClassificationGate(result)).toThrow(/gate failed/i)
	})
})
