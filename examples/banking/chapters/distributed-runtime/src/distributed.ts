import { gracefulShutdown, initLogger } from '@purista/core'
import { SqliteTransactionRepository } from './resources/SqliteTransactionRepository.js'
import { createProcessHttpServer } from './runtime/createProcessHttpServer.js'
import { assertDistributedCapabilities } from './runtime/distributedProfile.js'
import { monitoringDistributedV1Service } from './runtime/monitoringDistributedV1Service.js'
import {
	createNatsEventBridge,
	createNatsQueueBridge,
	createNatsStateStore,
} from './runtime/natsAdapters.js'
import { createNatsQueueJobStore } from './runtime/natsQueueJobStore.js'
import type { ProcessRuntime } from './runtime/ProcessRuntime.js'
import { startMonitoringProcess } from './runtime/startMonitoringProcess.js'
import { startReportingProcess } from './runtime/startReportingProcess.js'
import { startTransactionProcess } from './runtime/startTransactionProcess.js'

type ProcessRole = ProcessRuntime['role']

function readRole(value: string | undefined): ProcessRole {
	if (value === 'transaction' || value === 'monitoring' || value === 'reporting') return value
	throw new Error('PURISTA_PROCESS_ROLE must be transaction, monitoring, or reporting')
}

async function main() {
	const logger = initLogger('fatal')
	const role = readRole(process.env.PURISTA_PROCESS_ROLE)
	const servers = process.env.NATS_URL ?? 'nats://127.0.0.1:4222'
	const healthPort = Number.parseInt(process.env.HEALTH_PORT ?? '', 10)
	if (!Number.isInteger(healthPort) || healthPort < 1) throw new Error('HEALTH_PORT must be a positive integer')

	const eventBridge = await createNatsEventBridge(logger, servers)
	let runtime: ProcessRuntime

	if (role === 'transaction') {
		assertDistributedCapabilities(eventBridge.capabilities, undefined)
		const repository = new SqliteTransactionRepository(
			process.env.TRANSACTION_DB_PATH ?? 'var/distributed-transactions.sqlite',
		)
		runtime = await startTransactionProcess(logger, eventBridge, repository)
	} else if (role === 'monitoring') {
		assertDistributedCapabilities(eventBridge.capabilities, undefined)
		const stateStore = createNatsStateStore(logger, servers, 'example_bank_monitoring')
		runtime = await startMonitoringProcess(
			logger, eventBridge, stateStore, monitoringDistributedV1Service,
		)
	} else {
		const queueBridge = createNatsQueueBridge(servers)
		assertDistributedCapabilities(
			eventBridge.capabilities, queueBridge.capabilities, { requiresQueue: true },
		)
		const stateStore = createNatsStateStore(logger, servers, 'example_bank_reporting')
		runtime = await startReportingProcess(
			logger, eventBridge, queueBridge, stateStore, createNatsQueueJobStore(stateStore),
		)
	}

	const { http, listener } = await createProcessHttpServer(logger, runtime, healthPort)
	gracefulShutdown(logger, [
		http.prepareDestroy(),
		listener,
		http,
		{ name: `${role} runtime`, destroy: runtime.destroy },
	])
	process.stdout.write(`${role} process started.\n`)
}

main().catch(error => {
	process.stderr.write(`Distributed process could not start: ${error instanceof Error ? error.message : String(error)}\n`)
	process.exit(1)
})
