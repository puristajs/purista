import type { EventBridge, Logger } from '@purista/core'
import { sqliteHarnessStorage } from '@purista/harness'
import { openai } from '@purista/harness-openai'
import { HarnessConversationHistory } from './resources/HarnessConversationHistory.js'
import { supportV1Service } from './service/support/v1/supportV1Service.js'

export function createSupportService(
	eventBridge: EventBridge,
	logger: Logger,
	environment: Readonly<Record<string, string | undefined>> = process.env,
) {
	const apiKey = environment.OPENAI_API_KEY?.trim()
	if (!apiKey) throw new Error('OPENAI_API_KEY is required to run the conversation-history example.')
	const storage = sqliteHarnessStorage({
		file: environment.HARNESS_STORAGE_FILE?.trim() || 'conversation-history.sqlite',
	})

	return supportV1Service.getInstance(eventBridge, {
		logger,
		resources: {
			supportConversationHistory: new HarnessConversationHistory(storage),
			supportConversationPolicy: {
				canAccess: async ({ tenantId, principalId }) =>
					tenantId === 'tenant-example' && principalId === 'principal-alex',
			},
		},
		ai: {
			models: {
				primary: {
					provider: openai({ apiKey }),
					model: environment.OPENAI_MODEL?.trim() || 'gpt-5-mini',
				},
			},
			storage,
			telemetry: { contentCaptureMode: 'NO_CONTENT' },
		},
	})
}
