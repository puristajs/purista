import { type EvaluationRunResult, type ModelProvider, runEvaluation } from '@purista/harness'
import { type ClassificationAssessment, supportClassificationDataset } from './dataset.js'
import {
	type ClassificationInput,
	type ClassificationOutput,
	classificationHarness,
} from './harness/support/supportHarness.js'
import { categoryScorer, urgencyScorer } from './scorers.js'

export async function runClassificationEvaluation(
	provider: ModelProvider,
	options: Readonly<{ runId?: string; model?: string }> = {},
): Promise<EvaluationRunResult> {
	const harness = await classificationHarness.getInstance({
		models: { primary: { provider, model: options.model ?? 'evaluation-model' } },
	})
	try {
		return await runEvaluation<
			ClassificationInput,
			ClassificationAssessment,
			Record<string, never>,
			ClassificationOutput
		>({
			runId: options.runId ?? 'support-classification-eval-1',
			dataset: supportClassificationDataset,
			candidates: [{ id: 'classify-support-message', version: '1.0.0', config: {} }],
			task: {
				id: 'run-classification-agent',
				version: '1.0.0',
				async run(target) {
					const session = await harness.getSession(`evaluation:${target.evaluationRunId}:${target.caseId}`)
					const outcome = await session.agents.classify_support_message.run(target.input)
					if (outcome.status !== 'completed') throw new Error('Classification evaluation case did not complete')
					return { output: outcome.output, correlation: { runId: outcome.runId } }
				},
			},
			scorers: [categoryScorer, urgencyScorer],
			aggregateBy: ['category', 'urgency'],
			maxConcurrency: 1,
			failurePolicy: 'continue',
			timeouts: { runMs: 30_000, taskMs: 10_000, scorerMs: 1_000 },
		})
	} finally {
		await harness.shutdown()
	}
}
