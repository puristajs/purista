import type { EventBridge, Logger } from '@purista/core'
import type { HarnessStorage, ModelProvider } from '@purista/harness'
import { HarnessConversationHistory } from './resources/HarnessConversationHistory.js'
import type { SupportConversationPolicy } from './service/support/v1/SupportConversationPolicy.js'
import { supportV1Service } from './service/support/v1/supportV1Service.js'

export function createSupportService(
	eventBridge: EventBridge,
	logger: Logger,
	options: Readonly<{
		policy: SupportConversationPolicy
		model: { provider: ModelProvider; model: string }
		storage: HarnessStorage
	}>,
) {
	return supportV1Service.getInstance(eventBridge, {
		logger,
		resources: {
			supportConversationHistory: new HarnessConversationHistory(options.storage),
			supportConversationPolicy: options.policy,
		},
		ai: {
			models: { primary: options.model },
			storage: options.storage,
			telemetry: { contentCaptureMode: 'NO_CONTENT' },
		},
	})
}
