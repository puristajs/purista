import type { EventBridge, Logger } from '@purista/core'
import { openai } from '@purista/harness-openai'
import { supportV1Service } from './service/support/v1/supportV1Service.js'
import type { AccountReadPolicy, TransactionSummaryReader } from './service/transaction/v1/TransactionResources.js'
import { transactionV1Service } from './service/transaction/v1/transactionV1Service.js'

export async function createSupportApplication(
	eventBridge: EventBridge,
	logger: Logger,
	resources: Readonly<{
		accountReadPolicy: AccountReadPolicy
		transactionSummaryReader: TransactionSummaryReader
	}>,
	environment: Readonly<Record<string, string | undefined>> = process.env,
) {
	const apiKey = environment.OPENAI_API_KEY?.trim()
	if (!apiKey) throw new Error('OPENAI_API_KEY is required to run the support tool agent.')
	const transaction = await transactionV1Service.getInstance(eventBridge, { logger, resources })
	const support = await supportV1Service.getInstance(eventBridge, {
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
	await transaction.start()
	await support.start()
	return { support, transaction }
}
