import { getCommandMessageMock, initLogger } from '@purista/core'
import { transactionSchema } from './service/transaction/v1/transaction.js'
import { latestLargeDebitSignalKey, largeDebitSignalSchema } from './service/monitoring/v1/monitoringSignal.js'
import { reportingV1RequestSnapshotOutputPayloadSchema } from './service/reporting/v1/command/requestSnapshot/schema.js'
import { createNatsEventBridge, createNatsStateStore } from './runtime/natsAdapters.js'
import { createNatsQueueJobStore } from './runtime/natsQueueJobStore.js'

const logger = initLogger('fatal')
const servers = process.env.NATS_URL ?? 'nats://127.0.0.1:4222'

const delay = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds))

async function waitFor<T>(read: () => Promise<T | undefined>, label: string) {
	for (let attempt = 0; attempt < 100; attempt += 1) {
		const result = await read()
		if (result !== undefined) return result
		await delay(50)
	}
	throw new Error(`Timed out waiting for ${label}`)
}

async function recordTransaction(eventBridge: Awaited<ReturnType<typeof createNatsEventBridge>>) {
	const response = await eventBridge.invoke(getCommandMessageMock({
		tenantId: 'tenant-example',
		receiver: { serviceName: 'Transaction', serviceVersion: '1', serviceTarget: 'recordTransaction' },
		payload: {
			payload: { amountCents: 12_500, direction: 'debit', counterparty: 'Northwind Books' },
			parameter: { accountId: 'account-operating' },
		},
	}))
	return transactionSchema.parse(response)
}

async function waitForSignal(transactionId: string) {
	const stateStore = createNatsStateStore(logger, servers, 'example_bank_monitoring')
	try {
		return await waitFor(async () => {
			const result = await stateStore.getState(latestLargeDebitSignalKey)
			const signal = result[latestLargeDebitSignalKey]
			if (!signal) return undefined
			const parsed = largeDebitSignalSchema.parse(signal)
			return parsed.transactionId === transactionId ? parsed : undefined
		}, 'Monitoring signal')
	} finally {
		await stateStore.destroy()
	}
}

async function requestSnapshot(
	eventBridge: Awaited<ReturnType<typeof createNatsEventBridge>>,
	transactionId: string,
) {
	const response = await eventBridge.invoke(getCommandMessageMock({
		receiver: { serviceName: 'Reporting', serviceVersion: '1', serviceTarget: 'requestSnapshot' },
		payload: { payload: { transactionId }, parameter: {} },
	}))
	return reportingV1RequestSnapshotOutputPayloadSchema.parse(response)
}

async function waitForSnapshot(jobId: string) {
	const stateStore = createNatsStateStore(logger, servers, 'example_bank_reporting')
	const jobStore = createNatsQueueJobStore(stateStore)
	try {
		return await waitFor(async () => {
			const result = await jobStore.get(jobId)
			return result?.status === 'success' ? result : undefined
		}, 'Reporting queue result')
	} finally {
		await stateStore.destroy()
	}
}

async function main() {
	const mode = process.argv[2] ?? 'flow'
	const eventBridge = await createNatsEventBridge(logger, servers)
	try {
		if (mode === 'record') {
			const transaction = await recordTransaction(eventBridge)
			process.stdout.write(`${JSON.stringify({ transactionId: transaction.transactionId })}\n`)
			return
		}
		if (mode === 'wait-signal') {
			const transactionId = process.argv[3]
			if (!transactionId) throw new Error('wait-signal requires a transaction id')
			await waitForSignal(transactionId)
			process.stdout.write(`${JSON.stringify({ transactionId, recovered: true })}\n`)
			return
		}

		const transaction = await recordTransaction(eventBridge)
		const signal = await waitForSignal(transaction.transactionId)
		const first = await requestSnapshot(eventBridge, transaction.transactionId)
		const duplicate = await requestSnapshot(eventBridge, transaction.transactionId)
		const job = await waitForSnapshot(first.jobId)
		process.stdout.write(`${JSON.stringify({
			transactionId: transaction.transactionId,
			signalStored: signal.transactionId === transaction.transactionId,
			duplicateJobIdReused: duplicate.jobId === first.jobId,
			queueStatus: job.status,
		})}\n`)
	} finally {
		await eventBridge.destroy()
	}
}

main().catch(error => {
	process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
	process.exit(1)
})
