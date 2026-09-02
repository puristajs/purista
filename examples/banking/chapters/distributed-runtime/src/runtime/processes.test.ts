import {
	DefaultEventBridge,
	DefaultQueueBridge,
	createStateStoreQueueJobStore,
	initDefaultStateStore,
	initLogger,
} from '@purista/core'
import { expect, test } from 'vitest'
import { SqliteTransactionRepository } from '../resources/SqliteTransactionRepository.js'
import { startMonitoringProcess } from './startMonitoringProcess.js'
import { startReportingProcess } from './startReportingProcess.js'
import { startTransactionProcess } from './startTransactionProcess.js'

test('starts three independently composed service runtimes with default adapters', async () => {
	const logger = initLogger('fatal')
	const bridges = [0, 1, 2].map(() => new DefaultEventBridge({ logger }))
	await Promise.all(bridges.map(bridge => bridge.start()))
	const monitoringState = initDefaultStateStore({ logger })
	const reportingState = initDefaultStateStore({ logger })
	const runtimes = await Promise.all([
		startTransactionProcess(logger, bridges[0], new SqliteTransactionRepository(':memory:')),
		startMonitoringProcess(logger, bridges[1], monitoringState),
		startReportingProcess(
			logger, bridges[2], new DefaultQueueBridge(), reportingState,
			createStateStoreQueueJobStore(reportingState, 'example-bank:reporting-job'),
		),
	])
	try {
		expect(runtimes.map(runtime => runtime.role)).toEqual(['transaction', 'monitoring', 'reporting'])
		expect(runtimes.every(runtime => runtime.service.isStarted)).toBe(true)
		expect(new Set(runtimes.map(runtime => runtime.eventBridge.instanceId)).size).toBe(3)
	} finally {
		for (const runtime of runtimes.reverse()) await runtime.destroy()
	}
})
