import type { EventBridge, Logger } from '@purista/core'
import { InMemoryHarnessStorage } from '@purista/harness'
import { HarnessReviewWaitSignal } from './resources/HarnessReviewWaitSignal.js'
import { InMemorySupportReviewStore } from './resources/InMemorySupportReviewStore.js'
import type { SupportReviewPolicy } from './service/support/v1/SupportReviewResources.js'
import { supportV1Service } from './service/support/v1/supportV1Service.js'
import { transactionV1Service } from './service/transaction/v1/transactionV1Service.js'
import type { CardFreezeExecutor } from './service/transaction/v1/transactionV1ServiceBuilder.js'

export async function createReviewApplication(
	eventBridge: EventBridge,
	logger: Logger,
	supportReviewPolicy: SupportReviewPolicy,
	cardFreezeExecutor: CardFreezeExecutor,
) {
	const storage = new InMemoryHarnessStorage()
	const transaction = await transactionV1Service.getInstance(eventBridge, {
		logger,
		resources: { cardFreezeExecutor },
	})
	const support = await supportV1Service.getInstance(eventBridge, {
		logger,
		resources: {
			supportReviewStore: new InMemorySupportReviewStore(),
			supportReviewPolicy,
			reviewWaitSignal: new HarnessReviewWaitSignal(storage),
		},
		ai: { models: {}, storage },
	})
	await transaction.start()
	await support.start()
	return { support, transaction }
}
