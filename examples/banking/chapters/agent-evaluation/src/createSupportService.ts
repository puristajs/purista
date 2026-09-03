import type { EventBridge, Logger } from '@purista/core'
import { openai } from '@purista/harness-openai'
import { supportV1Service } from './service/support/v1/supportV1Service.js'

export function createSupportService(
	eventBridge: EventBridge,
	logger: Logger,
	environment: Readonly<Record<string, string | undefined>> = process.env,
) {
	const apiKey = environment.OPENAI_API_KEY?.trim()
	if (!apiKey) throw new Error('OPENAI_API_KEY is required to run the evaluated classification service.')

	return supportV1Service.getInstance(eventBridge, {
		logger,
		ai: {
			models: {
				primary: {
					provider: openai({ apiKey }),
					model: environment.OPENAI_MODEL?.trim() || 'gpt-5-mini',
				},
			},
			telemetry: { contentCaptureMode: 'NO_CONTENT' },
		},
	})
}
