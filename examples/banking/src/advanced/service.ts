import {
	HandledError,
	QueueWorkerBuilder,
	type QueueWorkerBuilderTypes,
	ServiceBuilder,
	type ServiceInfoType,
	StatusCode,
} from '@purista/core'
import { z } from 'zod'

import type { BankingRepository, RecordedTransaction } from '../repository.js'
import {
	accountIdSchema,
	BankingTutorialEvent,
	reconciliationDueEventSchema,
	transactionRecordedEventSchema,
} from './contracts.js'
import type { BankingOperationsStore } from './repository.js'

const emptyParameterSchema = z.object({})
const tenantParameterSchema = z.object({ tenantId: z.literal('tenant-north') })
const statementJobPayloadSchema = z.object({ accountId: accountIdSchema })
const reconciliationJobPayloadSchema = reconciliationDueEventSchema

const serviceInfo = {
	serviceName: 'bankingOperations',
	serviceVersion: '1',
	serviceDescription: 'Example Bank event monitoring, progress streams, and background operations',
} as const satisfies ServiceInfoType

const builder = new ServiceBuilder(serviceInfo)
	.defineResource<'bankingRepository', BankingRepository>()
	.defineResource<'operationsStore', BankingOperationsStore>()

const requireReadableAccount = async function (
	context: { message: { principalId?: string }; resources: { bankingRepository: BankingRepository } },
	accountId: RecordedTransaction['accountId'],
) {
	if (!context.resources.bankingRepository.canRead(context.message.principalId, accountId)) {
		throw new HandledError(StatusCode.Forbidden, 'You may not read this account')
	}
}

/**
 * A bounded business-event reaction. It records a training signal for later
 * review; it does not claim to make an anti-money-laundering decision.
 */
export const monitorRecordedTransaction = builder
	.getSubscriptionBuilder('monitorRecordedTransaction', 'Record a review signal for selected transaction events')
	.subscribeToEvent(BankingTutorialEvent.transactionRecorded)
	.addPayloadSchema(transactionRecordedEventSchema)
	.setSubscriptionFunction(async function (context, payload) {
		if (payload.amountMinor < 100_000) return
		context.resources.operationsStore.recordFinding({
			transactionId: payload.transactionId,
			accountId: payload.accountId,
			kind: 'review-required',
			reason: 'amount-at-or-above-training-threshold',
		})
	})

/** Three explicit progress frames keep the stream finite and easy to inspect in the UI. */
export const analyzeTransactionStream = builder
	.getStreamBuilder('analyzeTransaction', 'Streams a short, bounded transaction review')
	.addPayloadSchema(z.object({ accountId: accountIdSchema, transactionId: z.string().min(1) }))
	.addParameterSchema(emptyParameterSchema)
	.addChunkSchema(z.object({ stage: z.enum(['received', 'checking', 'complete']), message: z.string() }))
	.addFinalSchema(z.object({ status: z.literal('complete'), checkedSteps: z.literal(3) }))
	.exposeAsHttpStreamEndpoint('POST', 'transactions/analysis')
	.setBeforeGuardHooks({
		accountRead: async function (context, payload) {
			await requireReadableAccount(context, payload.accountId)
		},
	})
	.setStreamFunction(async function (context, payload, _parameter, writer) {
		const transaction = context.resources.bankingRepository
			.list(payload.accountId)
			.find(entry => entry.transactionId === payload.transactionId)
		if (!transaction) throw new HandledError(StatusCode.NotFound, 'The transaction does not exist in this account')

		await writer.write({ stage: 'received', message: 'Transaction received for review.' })
		await writer.write({ stage: 'checking', message: 'The example threshold and account scope were checked.' })
		await writer.write({ stage: 'complete', message: 'The short review is complete.' })
		await writer.close({ status: 'complete', checkedSteps: 3 })
	})

const statementQueue = builder
	.getQueueBuilder('banking.generateStatement', 'Generate an account statement in background work')
	.addPayloadSchema(statementJobPayloadSchema)
	.addParameterSchema(tenantParameterSchema)
	.setLifecycleConfig({ maxAttempts: 3, visibilityTimeoutMs: 30_000 })

export const generateStatementWorker = new QueueWorkerBuilder<
	QueueWorkerBuilderTypes<any, any, { bankingRepository: BankingRepository; operationsStore: BankingOperationsStore }>
>('banking.generateStatement', 'generateStatement')
	.setMode('continuous')
	.setBeforeGuardHooks({
		currentAccountRead: async function (context, message) {
			const workerContext = context as unknown as {
				message: { principalId?: string }
				resources: { bankingRepository: BankingRepository }
			}
			const workerMessage = message as { payload: z.infer<typeof statementJobPayloadSchema> }
			await requireReadableAccount(workerContext, workerMessage.payload.accountId)
		},
	})
	.setHandler(async function (context) {
		const payload = context.message.payload as z.infer<typeof statementJobPayloadSchema>
		const transactionCount = context.resources.bankingRepository.list(payload.accountId).length
		const statement = context.resources.operationsStore.saveStatement({
			statementId: `statement-${payload.accountId}`,
			accountId: payload.accountId,
			transactionCount,
			generatedAt: new Date().toISOString(),
		})
		await context.job.complete({ statementId: statement.statementId, accountId: statement.accountId, transactionCount })
		return { status: 'success' as const }
	})

export const requestStatementGeneration = builder
	.getCommandBuilder('requestStatementGeneration', 'Queue an account statement for the currently authorized reader')
	.addPayloadSchema(statementJobPayloadSchema)
	.addParameterSchema(emptyParameterSchema)
	.addOutputSchema(z.object({ jobId: z.string(), queueName: z.literal('banking.generateStatement') }))
	.canEnqueue('banking.generateStatement', statementJobPayloadSchema, tenantParameterSchema)
	.exposeAsHttpEndpoint('POST', 'statements/generate')
	.setBeforeGuardHooks({
		accountRead: async function (context, payload) {
			await requireReadableAccount(context, payload.accountId)
		},
	})
	.setCommandFunction(async function (context, payload) {
		const job = await context.queue.enqueue['banking.generateStatement'](
			payload,
			{ tenantId: 'tenant-north' },
			{
				idempotencyKey: `statement:${context.message.principalId ?? 'unknown'}:${payload.accountId}`,
			},
		)
		return { jobId: job.jobId, queueName: 'banking.generateStatement' }
	})

export const getGeneratedStatement = builder
	.getCommandBuilder(
		'getGeneratedStatement',
		'Return the latest generated statement metadata for one authorized account',
	)
	.addPayloadSchema(z.undefined())
	.addParameterSchema(z.object({ accountId: accountIdSchema }))
	.addOutputSchema(
		z.object({
			statementId: z.string(),
			accountId: accountIdSchema,
			transactionCount: z.number().int().nonnegative(),
			generatedAt: z.string().datetime(),
		}),
	)
	.exposeAsHttpEndpoint('GET', 'accounts/:accountId/generated-statement')
	.setBeforeGuardHooks({
		accountRead: async function (context, _payload, parameter) {
			await requireReadableAccount(context, parameter.accountId)
		},
	})
	.setCommandFunction(async function (context, _payload, parameter) {
		const statement = context.resources.operationsStore.getStatement(parameter.accountId)
		if (!statement) throw new HandledError(StatusCode.NotFound, 'No generated statement is available for this account')
		return statement
	})

const reconciliationQueue = builder
	.getQueueBuilder('banking.runReconciliation', 'Reconcile the local transaction and monitoring projections')
	.addPayloadSchema(reconciliationJobPayloadSchema)
	.addParameterSchema(tenantParameterSchema)
	.setLifecycleConfig({ maxAttempts: 3, visibilityTimeoutMs: 30_000 })

export const reconcileWorker = new QueueWorkerBuilder<
	QueueWorkerBuilderTypes<any, any, { bankingRepository: BankingRepository; operationsStore: BankingOperationsStore }>
>('banking.runReconciliation', 'reconcileBankingProjections')
	.setMode('continuous')
	.setHandler(async function (context) {
		const payload = context.message.payload as z.infer<typeof reconciliationJobPayloadSchema>
		const transactionCount = (['account-a', 'account-c'] as const).flatMap(accountId =>
			context.resources.bankingRepository.list(accountId),
		).length
		const findingCount = context.resources.operationsStore.listFindings().length
		const run = context.resources.operationsStore.recordReconciliation({
			runId: `reconciliation-${payload.day}`,
			day: payload.day,
			transactionCount,
			findingCount,
			completedAt: new Date().toISOString(),
		})
		await context.job.complete(run)
		return { status: 'success' as const }
	})

export const runReconciliation = builder
	.getCommandBuilder('runReconciliation', 'Queue a manual reconciliation run for one banking day')
	.addPayloadSchema(reconciliationDueEventSchema)
	.addParameterSchema(emptyParameterSchema)
	.addOutputSchema(z.object({ jobId: z.string(), queueName: z.literal('banking.runReconciliation') }))
	.canEnqueue('banking.runReconciliation', reconciliationJobPayloadSchema, tenantParameterSchema)
	.exposeAsHttpEndpoint('POST', 'reconciliation/run')
	.setCommandFunction(async function (context, payload) {
		const job = await context.queue.enqueue['banking.runReconciliation'](
			payload,
			{ tenantId: 'tenant-north' },
			{
				idempotencyKey: `reconciliation:${payload.day}`,
			},
		)
		return { jobId: job.jobId, queueName: 'banking.runReconciliation' }
	})

const dailyReconciliationSchedule = builder
	.getScheduleBuilder('dailyReconciliation', 'Emit a daily reconciliation trigger')
	.emitEvent(BankingTutorialEvent.reconciliationDue, {
		expression: { kind: 'cron', value: '5 2 * * *', timezone: 'Europe/Berlin' },
		missedRunPolicy: 'runOnce',
		payloadSchema: reconciliationDueEventSchema,
	})

export const bankingOperationsService = builder
	.addSubscriptionDefinition(monitorRecordedTransaction.getDefinition())
	.addStreamDefinition(analyzeTransactionStream.getDefinition())
	.addQueueDefinition(statementQueue.getDefinition(), reconciliationQueue.getDefinition())
	.addQueueWorkerDefinition(generateStatementWorker.getDefinition(), reconcileWorker.getDefinition())
	.addCommandDefinition(
		requestStatementGeneration.getDefinition(),
		getGeneratedStatement.getDefinition(),
		runReconciliation.getDefinition(),
	)
	.addScheduleDefinition(dailyReconciliationSchedule)
	.bindEventToQueue(BankingTutorialEvent.reconciliationDue, 'banking.runReconciliation', {
		idempotencyMode: 'advisory',
		idempotencyKey: event => `reconciliation:${String(event.day)}`,
		mapPayload: event => ({ day: String(event.day) }),
		mapParameter: () => ({ tenantId: 'tenant-north' }),
	})

/** Exposed for focused tutorial tests and for a composition root that needs the declared contracts. */
export { builder as bankingOperationsServiceBuilder }
