import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import type { EventBridge, Logger } from '@purista/core'
import { sqliteHarnessStorage } from '@purista/harness'
import { HarnessReviewWaitSignal } from './resources/HarnessReviewWaitSignal.js'
import { SqliteSupportReviewStore } from './resources/SqliteSupportReviewStore.js'
import type { SupportReviewPolicy } from './service/support/v1/SupportReviewResources.js'
import { supportV1Service } from './service/support/v1/supportV1Service.js'
import { transactionV1Service } from './service/transaction/v1/transactionV1Service.js'
import type { CardFreezeExecutor, CardFreezePolicy } from './service/transaction/v1/transactionV1ServiceBuilder.js'

export async function createReviewApplication(
	eventBridge: EventBridge,
	logger: Logger,
	supportReviewPolicy: SupportReviewPolicy,
	cardFreezePolicy: CardFreezePolicy,
	cardFreezeExecutor: CardFreezeExecutor,
	dataDirectory = '.data/human-review',
) {
	await mkdir(dataDirectory, { recursive: true })
	const storage = sqliteHarnessStorage({ file: join(dataDirectory, 'harness.sqlite') })
	const reviewStore = new SqliteSupportReviewStore(join(dataDirectory, 'reviews.sqlite'))
	const transaction = await transactionV1Service.getInstance(eventBridge, {
		logger,
		resources: { cardFreezeExecutor, cardFreezePolicy },
	})
	const support = await supportV1Service.getInstance(eventBridge, {
		logger,
		resources: {
			supportReviewStore: reviewStore,
			supportReviewPolicy,
			reviewWaitSignal: new HarnessReviewWaitSignal(storage),
		},
		ai: { models: {}, storage },
	})
	let destroyed = false
	const destroy = async () => {
		if (destroyed) return
		destroyed = true
		const errors: unknown[] = []
		for (const close of [() => support.destroy(), () => transaction.destroy(), () => storage.close()]) {
			try {
				await close()
			} catch (error) {
				errors.push(error)
			}
		}
		try {
			reviewStore.close()
		} catch (error) {
			errors.push(error)
		}
		if (errors.length > 0) throw new AggregateError(errors, 'Human review application shutdown failed')
	}
	try {
		await transaction.start()
		await support.start()
	} catch (startupError) {
		try {
			await destroy()
		} catch (shutdownError) {
			throw new AggregateError([startupError, shutdownError], 'Human review application startup failed')
		}
		throw startupError
	}

	return {
		name: 'Human review application',
		support,
		transaction,
		destroy,
	}
}
