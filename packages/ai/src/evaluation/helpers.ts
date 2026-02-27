import type { Schema } from '@purista/core'
import { validate } from '@purista/core'

/**
 * Individual test case captured inside an evaluation run.
 */
export type EvaluationSample = {
	input: unknown
	expected: unknown
	actual?: unknown
	success?: boolean
	durationMs?: number
	tokens?: number
}

/**
 * Aggregated metrics for one workload/dataset pair.
 */
export type EvaluationResult = {
	workload: string
	manifestVersion: string
	dataset: string
	summary: {
		total: number
		successes: number
		failures: number
		avgDurationMs?: number
	}
	samples: EvaluationSample[]
}

/**
 * Creates a normalized evaluation summary from raw samples.
 */
export const createEvaluationResult = (input: {
	workload: string
	manifestVersion: string
	dataset: string
	samples: EvaluationSample[]
}): EvaluationResult => {
	const successes = input.samples.filter(sample => sample.success).length
	const failures = input.samples.length - successes
	const avgDuration = input.samples.reduce((acc, sample) => acc + (sample.durationMs ?? 0), 0) / input.samples.length

	return {
		workload: input.workload,
		manifestVersion: input.manifestVersion,
		dataset: input.dataset,
		summary: {
			total: input.samples.length,
			successes,
			failures,
			avgDurationMs: Number.isNaN(avgDuration) ? undefined : avgDuration,
		},
		samples: input.samples,
	}
}

/**
 * Produces a quick diff between two runs so regressions are easy to spot.
 */
export const diffEvaluationResults = (a: EvaluationResult, b: EvaluationResult) => {
	return {
		workload: a.workload,
		baseline: a.summary,
		candidate: b.summary,
		deltaSuccess: b.summary.successes - a.summary.successes,
		deltaDuration: (b.summary.avgDurationMs ?? 0) - (a.summary.avgDurationMs ?? 0),
	}
}

/**
 * Validates a dataset row using the same schema tooling as commands.
 */
export const validateDataset = async (schema: Schema, record: unknown) => {
	const result = await validate(schema, record)
	if (!result.success) {
		const reason = result.issues.map(issue => issue.message ?? JSON.stringify(issue)).join('; ')
		throw new Error(`Dataset validation failed: ${reason}`)
	}
	return result.data
}
