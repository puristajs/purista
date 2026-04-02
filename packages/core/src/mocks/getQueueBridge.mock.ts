import type { SinonSandbox, SinonStub } from 'sinon'
import { stub } from 'sinon'

import type { QueueBridge } from '../core/QueueBridge/types/QueueBridge.js'
import type { QueueBridgeCapabilities } from '../core/QueueBridge/types/QueueBridgeCapabilities.js'

/**
 * Mocks the queue bridge and stubs the methods.
 *
 * @group Unit test helper
 */
export const getQueueBridgeMock = (
	sandboxOrOptions?: SinonSandbox | { sandbox?: SinonSandbox; capabilities?: Partial<QueueBridgeCapabilities> },
): { mock: QueueBridge; stubs: Record<string, SinonStub> } => {
	const sandbox = sandboxOrOptions && 'stub' in sandboxOrOptions ? sandboxOrOptions : sandboxOrOptions?.sandbox
	const capabilityOverrides =
		sandboxOrOptions && 'stub' in sandboxOrOptions ? undefined : sandboxOrOptions?.capabilities
	const enqueue =
		sandbox?.stub().resolves({ jobId: 'job', queueName: 'queue' }) ??
		stub().resolves({ jobId: 'job', queueName: 'queue' })
	const leaseNext = sandbox?.stub().resolves(undefined) ?? stub().resolves(undefined)
	const extendLease = sandbox?.stub().resolves() ?? stub().resolves()
	const ack = sandbox?.stub().resolves() ?? stub().resolves()
	const nack = sandbox?.stub().resolves() ?? stub().resolves()
	const moveToDeadLetter = sandbox?.stub().resolves() ?? stub().resolves()
	const peekDeadLetter = sandbox?.stub().resolves([]) ?? stub().resolves([])
	const redriveDeadLetter = sandbox?.stub().resolves(0) ?? stub().resolves(0)
	const purgeDeadLetter = sandbox?.stub().resolves(0) ?? stub().resolves(0)
	const inspectLeases = sandbox?.stub().resolves([]) ?? stub().resolves([])
	const metrics =
		sandbox?.stub().resolves({ pending: 0, inflight: 0, deadLetter: 0, retries: 0 }) ??
		stub().resolves({ pending: 0, inflight: 0, deadLetter: 0, retries: 0 })
	const start = sandbox?.stub().resolves() ?? stub().resolves()
	const destroy = sandbox?.stub().resolves() ?? stub().resolves()
	const isReady = sandbox?.stub().resolves(true) ?? stub().resolves(true)
	const isHealthy = sandbox?.stub().resolves(true) ?? stub().resolves(true)
	const defaultCapabilities: QueueBridgeCapabilities = {
		delayedDelivery: true,
		fifoOrdering: true,
		partitions: false,
		priorities: false,
		deadLetterNative: false,
		exactlyOnce: false,
		maxBatchSize: 1,
		defaultDeadLetterPrefix: '',
		defaultDeadLetterSuffix: '.dead-letter',
		deadLetterInspectable: true,
		deadLetterInspectSupported: true,
		deadLetterReplaySupported: true,
		deadLetterPurgeSupported: true,
		leaseInspectionSupported: true,
		idempotencyEnforcement: false,
		partitionOrdering: false,
		providerManagedDelayedDelivery: true,
		strictStartupValidation: true,
	}

	const mock: QueueBridge = {
		name: 'QueueBridgeMock',
		instanceId: 'queue-mock',
		capabilities: {
			...defaultCapabilities,
			...capabilityOverrides,
		},
		start,
		destroy,
		isReady,
		isHealthy,
		enqueue,
		leaseNext,
		extendLease,
		ack,
		nack,
		moveToDeadLetter,
		peekDeadLetter,
		redriveDeadLetter,
		purgeDeadLetter,
		inspectLeases,
		metrics,
	}

	return {
		stubs: {
			enqueue,
			leaseNext,
			extendLease,
			ack,
			nack,
			moveToDeadLetter,
			peekDeadLetter,
			redriveDeadLetter,
			purgeDeadLetter,
			inspectLeases,
			metrics,
			start,
			destroy,
			isReady,
			isHealthy,
		},
		mock,
	}
}
