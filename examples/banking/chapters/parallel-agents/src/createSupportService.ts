import type { EventBridge, Logger } from '@purista/core'
import type { ModelProvider } from '@purista/harness'
import type { SupportCasePolicy } from './service/support/v1/SupportResources.js'
import { supportV1Service } from './service/support/v1/supportV1Service.js'

export function createSupportService(
	eventBridge: EventBridge,
	logger: Logger,
	options: Readonly<{
		supportCasePolicy: SupportCasePolicy
		riskModel: { provider: ModelProvider; model: string }
		responseModel: { provider: ModelProvider; model: string }
	}>,
) {
	return supportV1Service.getInstance(eventBridge, {
		logger,
		resources: { supportCasePolicy: options.supportCasePolicy },
		ai: {
			models: {
				riskAssessment: options.riskModel,
				responsePlanning: options.responseModel,
			},
		},
	})
}
