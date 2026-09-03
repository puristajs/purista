import type { EventBridge, Logger } from '@purista/core'
import type { ModelProvider } from '@purista/harness'
import type { SupportClassificationPolicy } from './service/support/v1/SupportResources.js'
import { supportV1Service } from './service/support/v1/supportV1Service.js'

export function createSupportService(
	eventBridge: EventBridge,
	logger: Logger,
	options: Readonly<{
		policy: SupportClassificationPolicy
		model: { provider: ModelProvider; model: string }
	}>,
) {
	return supportV1Service.getInstance(eventBridge, {
		logger,
		resources: { supportClassificationPolicy: options.policy },
		ai: {
			models: { primary: options.model },
			telemetry: { contentCaptureMode: 'NO_CONTENT' },
		},
	})
}
