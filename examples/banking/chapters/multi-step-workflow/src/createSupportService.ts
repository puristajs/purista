import type { EventBridge, Logger } from '@purista/core'
import type { HarnessStorage, ModelProvider } from '@purista/harness'
import type { SupportCasePolicy } from './service/support/v1/SupportResources.js'
import { supportV1Service } from './service/support/v1/supportV1Service.js'

export function createSupportService(
	eventBridge: EventBridge,
	logger: Logger,
	options: Readonly<{
		supportCasePolicy: SupportCasePolicy
		storage: HarnessStorage
		classificationModel: { provider: ModelProvider; model: string }
		resolutionModel: { provider: ModelProvider; model: string }
	}>,
) {
	return supportV1Service.getInstance(eventBridge, {
		logger,
		resources: { supportCasePolicy: options.supportCasePolicy },
		ai: {
			storage: options.storage,
			models: {
				classificationModel: options.classificationModel,
				resolutionModel: {
					...options.resolutionModel,
					retry: {
						maxAttempts: 2,
						minDelayMs: 1,
						maxDelayMs: 10,
						maxActiveDelayMs: 100,
						maxActiveElapsedMs: 1_000,
						retryOn: { serverError: true },
					},
				},
			},
		},
	})
}
