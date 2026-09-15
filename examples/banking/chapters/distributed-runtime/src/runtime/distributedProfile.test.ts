import {
	getEventBridgeMock,
	getLoggerMock,
	getQueueBridgeMock,
	initDefaultStateStore,
} from '@purista/core'
import { createSandbox } from 'sinon'
import { expect, test } from 'vitest'
import { reportingV1Service } from '../service/reporting/v1/reportingV1Service.js'
import { assertDistributedCapabilities } from './distributedProfile.js'

const distributedEventCapabilities = getEventBridgeMock({
	capabilities: {
		durableSubscriptions: true,
		manualAckSupported: true,
		supportsStreams: false,
		commandHandling: {
			...getEventBridgeMock().mock.capabilities.commandHandling,
			pendingInvocationCancellation: false,
		},
	},
}).mock.capabilities

const distributedQueueCapabilities = getQueueBridgeMock({
	capabilities: { idempotencyEnforcement: true, strictStartupValidation: true },
}).mock.capabilities

test('accepts the required durable event and queue capabilities', () => {
	expect(() => assertDistributedCapabilities(
		distributedEventCapabilities, distributedQueueCapabilities, { requiresQueue: true },
	)).not.toThrow()
})

test('rejects stream and command cancellation requirements not supplied by NATS', () => {
	expect(() => assertDistributedCapabilities(
		distributedEventCapabilities, distributedQueueCapabilities,
		{ requiresIncrementalStreams: true },
	)).toThrow('cannot carry PURISTA incremental streams')
	expect(() => assertDistributedCapabilities(
		distributedEventCapabilities, distributedQueueCapabilities,
		{ requiresPendingCommandCancellation: true },
	)).toThrow('cannot cancel a pending command invocation')
})

test('fails Reporting startup when FIFO is unavailable', async () => {
	const sandbox = createSandbox()
	const eventBridge = getEventBridgeMock(sandbox).mock
	const queueBridge = getQueueBridgeMock({
		sandbox,
		capabilities: { fifoOrdering: false, strictStartupValidation: true },
	}).mock
	const stateStore = initDefaultStateStore({ logger: getLoggerMock(sandbox).mock })
	const service = await reportingV1Service.getInstance(eventBridge, {
		logger: getLoggerMock(sandbox).mock,
		queueBridge,
		stateStore,
	})
	try {
		await expect(service.start()).rejects.toThrow('requires fifo ordering')
	} finally {
		await service.destroy()
		await stateStore.destroy()
		sandbox.restore()
	}
})
