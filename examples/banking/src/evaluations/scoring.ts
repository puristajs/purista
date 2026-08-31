import { z } from 'zod'

const categorySchema = z.enum(['account-access', 'card-payment', 'other'])

/** Synthetic, human-reviewed offline cases. Expected labels are never sent to a candidate. */
export const evaluationCaseSchema = z.object({
	caseId: z.string().min(1),
	split: z.enum(['development', 'holdout']),
	expectedCategory: categorySchema,
	expectedAccess: z.enum(['allowed', 'denied']),
})

export const evaluationResultSchema = z.object({
	caseId: z.string().min(1),
	observedCategory: categorySchema.nullable(),
	access: z.enum(['allowed', 'denied']),
	completed: z.boolean(),
})

export const scoreEvaluation = (
	cases: readonly z.infer<typeof evaluationCaseSchema>[],
	results: readonly z.infer<typeof evaluationResultSchema>[],
) => {
	const byCase = new Map(results.map(result => [result.caseId, result]))
	const rows = cases.map(testCase => {
		const result = byCase.get(testCase.caseId)
		const complete = result?.completed === true
		const accessPass = result?.access === testCase.expectedAccess
		const categoryPass = testCase.expectedAccess === 'denied' || result?.observedCategory === testCase.expectedCategory
		return {
			caseId: testCase.caseId,
			complete,
			accessPass,
			categoryPass,
			passed: complete && accessPass && categoryPass,
		}
	})
	return {
		rows,
		passed: rows.every(row => row.passed),
		categoryAccuracy: rows.filter(row => row.categoryPass).length / Math.max(rows.length, 1),
	}
}
