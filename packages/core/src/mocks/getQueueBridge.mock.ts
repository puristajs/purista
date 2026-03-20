import type { SinonSandbox, SinonStub } from 'sinon'
import { stub } from 'sinon'

import type { QueueBridge } from '../core/QueueBridge/types/QueueBridge.js'

/**
 * Mocks the queue bridge and stubs the methods.
 *
 * @group Unit test helper
 */
export const getQueueBridgeMock = (sandbox?: SinonSandbox): { mock: QueueBridge; stubs: Record<string, SinonStub> } => {
	const enqueue =
		sandbox?.stub().resolves({ jobId: 'job', queueName: 'queue' }) ??
		stub().resolves({ jobId: 'job', queueName: 'queue' })
	const leaseNext = sandbox?.stub().resolves(undefined) ?? stub().resolves(undefined)
	const extendLease = sandbox?.stub().resolves() ?? stub().resolves()
	const ack = sandbox?.stub().resolves() ?? stub().resolves()
	const nack = sandbox?.stub().resolves() ?? stub().resolves()
	const moveToDeadLetter = sandbox?.stub().resolves() ?? stub().resolves()
	const metrics =
		sandbox?.stub().resolves({ pending: 0, inflight: 0, deadLetter: 0, retries: 0 }) ??
		stub().resolves({ pending: 0, inflight: 0, deadLetter: 0, retries: 0 })
	const start = sandbox?.stub().resolves() ?? stub().resolves()
	const destroy = sandbox?.stub().resolves() ?? stub().resolves()
	const isReady = sandbox?.stub().resolves(true) ?? stub().resolves(true)
	const isHealthy = sandbox?.stub().resolves(true) ?? stub().resolves(true)

	const mock: QueueBridge = {
		name: 'QueueBridgeMock',
		instanceId: 'queue-mock',
		capabilities: {
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
			metrics,
			start,
			destroy,
			isReady,
			isHealthy,
		},
		mock,
	}
}
