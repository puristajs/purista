import type { EventBridge, Logger } from '@purista/core'
import { inMemorySandbox, type ModelProvider } from '@purista/harness'
import type { SupportProcedurePolicy } from './service/support/v1/SupportProcedurePolicy.js'
import { supportV1Service } from './service/support/v1/supportV1Service.js'

export function createSupportService(
	eventBridge: EventBridge,
	logger: Logger,
	options: Readonly<{
		policy: SupportProcedurePolicy
		model: { provider: ModelProvider; model: string }
	}>,
) {
	return supportV1Service.getInstance(eventBridge, {
		logger,
		resources: { supportProcedurePolicy: options.policy },
		ai: {
			models: { primary: options.model },
			sandbox: inMemorySandbox(),
			telemetry: { contentCaptureMode: 'NO_CONTENT' },
		},
	})
}
