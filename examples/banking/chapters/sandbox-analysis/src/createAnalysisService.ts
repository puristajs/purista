import type { EventBridge, Logger } from '@purista/core'
import type { ModelProvider, Sandbox } from '@purista/harness'
import type { AnalysisPolicy } from './service/analysis/v1/AnalysisResources.js'
import { analysisV1Service } from './service/analysis/v1/analysisV1Service.js'

export function createAnalysisService(
	eventBridge: EventBridge,
	logger: Logger,
	options: Readonly<{
		analysisPolicy: AnalysisPolicy
		analysisModel: { provider: ModelProvider; model: string }
		sandbox: Sandbox
	}>,
) {
	return analysisV1Service.getInstance(eventBridge, {
		logger,
		resources: { analysisPolicy: options.analysisPolicy },
		ai: {
			models: { analysis_model: options.analysisModel },
			sandbox: options.sandbox,
			telemetry: { contentCaptureMode: 'NO_CONTENT' },
		},
	})
}
