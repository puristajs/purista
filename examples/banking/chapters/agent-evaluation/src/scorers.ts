import { createDeterministicEvaluationScorer, type EvaluationRunResult } from '@purista/harness'
import type { ClassificationAssessment } from './dataset.js'
import type { ClassificationOutput } from './harness/support/supportClassificationSchemas.js'

export const categoryScorer = createDeterministicEvaluationScorer<ClassificationAssessment, ClassificationOutput>({
	id: 'classification-category',
	version: '1.0.0',
	dimension: { id: 'category_exact', kind: 'boolean' },
	evaluate: (observation) => {
		const passed = observation.assessment?.category === observation.output.category
		return { outcome: 'scored', dimensionId: 'category_exact', kind: 'boolean', value: passed, passed }
	},
})

export const urgencyScorer = createDeterministicEvaluationScorer<ClassificationAssessment, ClassificationOutput>({
	id: 'classification-urgency',
	version: '1.0.0',
	dimension: { id: 'urgency_exact', kind: 'boolean' },
	evaluate: (observation) => {
		const passed = observation.assessment?.urgency === observation.output.urgency
		return { outcome: 'scored', dimensionId: 'urgency_exact', kind: 'boolean', value: passed, passed }
	},
})

export function passRate(result: EvaluationRunResult, dimensionId: string) {
	const aggregate = result.dimensionAggregates.find(
		(item) => item.dimensionId === dimensionId && item.scope.kind === 'all',
	)
	if (!aggregate) throw new Error(`Missing evaluation aggregate ${dimensionId}`)
	return aggregate.passCounts?.rate ?? 0
}
