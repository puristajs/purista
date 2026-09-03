import type { EventBridge, Logger } from '@purista/core'
import type { DurableWorkspace, HarnessStorage, ModelProvider, Sandbox } from '@purista/harness'
import type { SupportCasePolicy } from './service/support/v1/SupportResources.js'
import { supportV1Service } from './service/support/v1/supportV1Service.js'

export function createSupportService(
	eventBridge: EventBridge,
	logger: Logger,
	options: Readonly<{
		supportCasePolicy: SupportCasePolicy
		storage: HarnessStorage
		sandbox?: Sandbox
		workspace?: DurableWorkspace
		classificationModel: { provider: ModelProvider; model: string }
		resolutionModel: { provider: ModelProvider; model: string }
	}>,
) {
	return supportV1Service.getInstance(eventBridge, {
		logger,
		resources: { supportCasePolicy: options.supportCasePolicy },
		ai: {
			storage: options.storage,
			...(options.sandbox ? { sandbox: options.sandbox } : {}),
			...(options.workspace ? { workspace: options.workspace } : {}),
			models: {
				classification_model: options.classificationModel,
				resolution_model: options.resolutionModel,
			},
			telemetry: { contentCaptureMode: 'NO_CONTENT' },
		},
	})
}
