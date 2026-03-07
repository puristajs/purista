import { describe, expect, it } from 'vitest'

import { createEvaluationResult, diffEvaluationResults } from './helpers.js'

describe('evaluation helpers', () => {
	it('creates and diffs evaluation summaries', () => {
		const baseline = createEvaluationResult({
			workload: 'agentA',
			manifestVersion: '1',
			dataset: 'sample',
			samples: [
				{ input: 'a', expected: 'A', actual: 'A', success: true, durationMs: 10 },
				{ input: 'b', expected: 'B', actual: 'C', success: false, durationMs: 20 },
			],
		})

		const candidate = createEvaluationResult({
			workload: 'agentA',
			manifestVersion: '1',
			dataset: 'sample',
			samples: [
				{ input: 'a', expected: 'A', actual: 'A', success: true, durationMs: 5 },
				{ input: 'b', expected: 'B', actual: 'B', success: true, durationMs: 15 },
			],
		})

		const diff = diffEvaluationResults(baseline, candidate)
		expect(diff.deltaSuccess).toBe(1)
		expect(diff.deltaDuration).toBeLessThan(0)
	})
})
