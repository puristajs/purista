import type { EventBridge, Logger } from '@purista/core'
import { openai } from '@purista/harness-openai'
import type { SupportCasePolicy } from './service/support/v1/SupportResources.js'
import { supportV1Service } from './service/support/v1/supportV1Service.js'

export function createSupportService(
	eventBridge: EventBridge,
	logger: Logger,
	supportCasePolicy: SupportCasePolicy,
	environment: Readonly<Record<string, string | undefined>> = process.env,
) {
	const apiKey = environment.OPENAI_API_KEY?.trim()
	if (!apiKey) throw new Error('OPENAI_API_KEY is required to run the support analysis workflow.')
	const provider = openai({ apiKey })
	const model = environment.OPENAI_MODEL?.trim() || 'gpt-5-mini'
	return supportV1Service.getInstance(eventBridge, {
		logger,
		resources: { supportCasePolicy },
		ai: {
			models: {
				risk_model: { provider, model },
				response_model: { provider, model },
			},
			telemetry: { contentCaptureMode: 'NO_CONTENT' },
		},
	})
}
