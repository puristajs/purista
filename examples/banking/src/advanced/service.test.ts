import {
	createCommandContextMock,
	createQueueWorkerContextMock,
	createStreamContextMock,
	createSubscriptionContextMock,
	DefaultEventBridge,
	DefaultQueueBridge,
} from '@purista/core'
import { describe, expect, it } from 'vitest'

import { BankingRepository } from '../repository.js'
import { BankingOperationsStore } from './repository.js'
import {
	analyzeTransactionStream,
	bankingOperationsService,
	generateStatementWorker,
	monitorRecordedTransaction,
	reconcileWorker,
	requestStatementGeneration,
	runReconciliation,
} from './service.js'

const createResources = () => ({
	bankingRepository: new BankingRepository(),
	operationsStore: new BankingOperationsStore(),
})

describe('advanced banking tutorial definitions', () => {
	it('starts every advanced definition with the local event and queue bridges', async () => {
		const eventBridge = new DefaultEventBridge()
		const queueBridge = new DefaultQueueBridge()
		const resources = createResources()
		await eventBridge.start()
		await queueBridge.start()

		const service = await bankingOperationsService.getInstance(eventBridge, { queueBridge, resources })
		try {
			await service.start()
		} finally {
			await service.destroy()
			await queueBridge.destroy()
			await eventBridge.destroy()
		}
	})

	it('records a bounded monitoring finding from a transaction event', async () => {
		const resources = createResources()
		const { context } = createSubscriptionContextMock(monitorRecordedTransaction, {
			message: {} as never,
			resources,
		})

		await monitorRecordedTransaction.getSubscriptionFunction().call(
			{} as never,
			context,
			{
				transactionId: 'transaction-high-value',
				accountId: 'account-a',
				amountMinor: 100_000,
				currency: 'EUR',
				direction: 'credit',
				bookedAt: '2026-01-20T10:00:00.000Z',
			},
			{},
		)

		expect(resources.operationsStore.listFindings()).toEqual([
			expect.objectContaining({ transactionId: 'transaction-high-value', kind: 'review-required' }),
		])
	})

	it('writes exactly three progress chunks for an authorized transaction review', async () => {
		const resources = createResources()
		const { context, chunks, writer } = createStreamContextMock(analyzeTransactionStream, {
			payload: { accountId: 'account-a', transactionId: 'transaction-seed-a-1' },
			parameter: {},
			resources,
		})

		await analyzeTransactionStream
			.getStreamFunction()
			.call({} as never, context, { accountId: 'account-a', transactionId: 'transaction-seed-a-1' }, {}, writer)

		expect(chunks.map(chunk => chunk.stage)).toEqual(['received', 'checking', 'complete'])
	})

	it('generates a statement from one queue job and records its projection', async () => {
		const resources = createResources()
		const mock = createQueueWorkerContextMock(generateStatementWorker, {
			queueName: 'banking.generateStatement',
			payload: { accountId: 'account-a', initiatorPrincipalId: 'alice' },
			parameter: { tenantId: 'tenant-north' },
			resources,
		})

		const definition = await generateStatementWorker.getDefinition()
		await definition.handler(mock.context, mock.message)

		expect(mock.stubs.job.complete.calledOnce).toBe(true)
		expect(resources.operationsStore.getStatement('account-a')).toMatchObject({
			statementId: 'statement-account-a',
			transactionCount: 1,
		})
	})

	it('enqueues a manual reconciliation job and writes an idempotent run projection', async () => {
		const resources = createResources()
		const command = createCommandContextMock(runReconciliation, {
			payload: { day: '2026-01-20', source: 'banking-projections' },
			parameter: {},
			resources,
		})
		command.stubs.enqueue.resolves({ jobId: 'job-reconciliation-1', queueName: 'banking.runReconciliation' })
		const reconciliationContext = {
			...command.context,
			message: { ...command.context.message, principalId: 'dana', tenantId: 'tenant-north' },
		}

		const queued = await runReconciliation
			.getCommandFunction()
			.call({} as never, reconciliationContext, { day: '2026-01-20', source: 'banking-projections' }, {})
		expect(queued).toEqual({ jobId: 'job-reconciliation-1', queueName: 'banking.runReconciliation' })

		const worker = createQueueWorkerContextMock(reconcileWorker, {
			queueName: 'banking.runReconciliation',
			payload: { day: '2026-01-20', source: 'banking-projections' },
			parameter: { tenantId: 'tenant-north' },
			resources,
		})
		const definition = await reconcileWorker.getDefinition()
		await definition.handler(worker.context, worker.message)
		await definition.handler(worker.context, worker.message)

		expect(resources.operationsStore.listReconciliationRuns()).toHaveLength(1)
		expect(resources.operationsStore.listReconciliationRuns()[0]).toMatchObject({
			day: '2026-01-20',
			transactionCount: 1,
		})
	})

	it('declares the statement command queue boundary', async () => {
		const resources = createResources()
		resources.bankingRepository.canRead = () => true
		const command = createCommandContextMock(requestStatementGeneration, {
			payload: { accountId: 'account-a' },
			parameter: {},
			resources,
		})
		command.stubs.enqueue.resolves({ jobId: 'job-statement-1', queueName: 'banking.generateStatement' })
		const context = {
			...command.context,
			message: { ...command.context.message, principalId: 'alice' },
		}

		const queued = await requestStatementGeneration
			.getCommandFunction()
			.call({} as never, context as never, { accountId: 'account-a' }, {})
		expect(queued).toEqual({ jobId: 'job-statement-1', queueName: 'banking.generateStatement' })
	})
})
