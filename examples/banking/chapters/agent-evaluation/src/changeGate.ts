import type { EvaluationRunResult } from '@purista/harness'
import { passRate } from './scorers.js'

export interface ClassificationGateThresholds {
	categoryRate: number
	urgencyRate: number
}

export function assertClassificationGate(
	result: EvaluationRunResult,
	thresholds: ClassificationGateThresholds = { categoryRate: 1, urgencyRate: 1 },
) {
	if (result.status !== 'completed') throw new Error(`Evaluation did not complete cleanly: ${result.status}`)
	const categoryRate = passRate(result, 'category_exact')
	const urgencyRate = passRate(result, 'urgency_exact')
	if (categoryRate < thresholds.categoryRate || urgencyRate < thresholds.urgencyRate) {
		throw new Error(
			`Classification gate failed: category=${categoryRate.toFixed(3)}, urgency=${urgencyRate.toFixed(3)}`,
		)
	}
	return { categoryRate, urgencyRate }
}
