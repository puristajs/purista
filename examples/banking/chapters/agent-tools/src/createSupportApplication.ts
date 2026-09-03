import type { EventBridge, Logger } from '@purista/core'
import type { ModelProvider } from '@purista/harness'
import type { SupportQuestionPolicy } from './service/support/v1/SupportResources.js'
import { supportV1Service } from './service/support/v1/supportV1Service.js'
import type { AccountReadPolicy, TransactionSummaryReader } from './service/transaction/v1/TransactionResources.js'
import { transactionV1Service } from './service/transaction/v1/transactionV1Service.js'

export async function createSupportApplication(
	eventBridge: EventBridge,
	logger: Logger,
	resources: Readonly<{
		accountReadPolicy: AccountReadPolicy
		transactionSummaryReader: TransactionSummaryReader
		supportQuestionPolicy: SupportQuestionPolicy
	}>,
	model: Readonly<{ provider: ModelProvider; model: string }>,
) {
	const transaction = await transactionV1Service.getInstance(eventBridge, {
		logger,
		resources: {
			accountReadPolicy: resources.accountReadPolicy,
			transactionSummaryReader: resources.transactionSummaryReader,
		},
	})
	const support = await supportV1Service.getInstance(eventBridge, {
		logger,
		resources: { supportQuestionPolicy: resources.supportQuestionPolicy },
		ai: {
			models: { primary: model },
			telemetry: { contentCaptureMode: 'NO_CONTENT' },
		},
	})
	await transaction.start()
	await support.start()
	return { support, transaction }
}
