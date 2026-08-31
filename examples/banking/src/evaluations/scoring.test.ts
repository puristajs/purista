import { describe, expect, it } from 'vitest'

import { scoreEvaluation } from './scoring.js'

describe('offline banking evaluation scorer', () => {
	it('fails a candidate that has good categories but leaks a denied account case', () => {
		const report = scoreEvaluation(
			[
				{ caseId: 'dev-card', split: 'development', expectedCategory: 'card-payment', expectedAccess: 'allowed' },
				{ caseId: 'holdout-denied', split: 'holdout', expectedCategory: 'other', expectedAccess: 'denied' },
			],
			[
				{ caseId: 'dev-card', observedCategory: 'card-payment', access: 'allowed', completed: true },
				{ caseId: 'holdout-denied', observedCategory: 'other', access: 'allowed', completed: true },
			],
		)

		expect(report.categoryAccuracy).toBe(1)
		expect(report.passed).toBe(false)
		expect(report.rows[1]).toMatchObject({ accessPass: false, passed: false })
	})
})
