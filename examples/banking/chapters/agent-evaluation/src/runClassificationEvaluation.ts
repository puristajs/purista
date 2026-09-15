import { type EvaluationRunResult, type ModelProvider, runEvaluation } from '@purista/harness'
import { type ClassificationAssessment, supportClassificationDataset } from './dataset.js'
import { categoryScorer, urgencyScorer } from './scorers.js'
import type {
	ClassificationInput,
	ClassificationOutput,
} from './service/support/v1/harness/agent/classifySupportMessage/classifySupportMessageAgent.js'
import { supportHarness } from './service/support/v1/harness/supportHarness.js'

export async function runClassificationEvaluation(
	provider: ModelProvider,
	options: Readonly<{ runId?: string; model?: string }> = {},
): Promise<EvaluationRunResult> {
	const harness = await supportHarness.getInstance({
		models: { classification: { provider, model: options.model ?? 'evaluation-model' } },
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
					try {
						const outcome = await session.agents.classifySupportMessage.run(target.input)
						return { output: outcome.output, correlation: { runId: outcome.runId } }
					} finally {
						await session.release()
					}
				},
			},
			scorers: [categoryScorer, urgencyScorer],
			aggregateBy: ['category', 'urgency'],
			maxConcurrency: 1,
			failurePolicy: 'continue',
			timeouts: { runMs: 30_000, taskMs: 10_000, scorerMs: 1_000 },
		})
	} finally {
		await harness.close()
	}
}
