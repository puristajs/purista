import type { AnyHarnessTargetContract } from '@purista/harness'
import { isHarnessTargetContract } from '@purista/harness/integrator'

import type { QueueDefinitionBuilder } from '../QueueDefinitionBuilder/QueueDefinitionBuilder.impl.js'
import type { QueueWorkerBuilder } from '../QueueWorkerBuilder/QueueWorkerBuilder.impl.js'
import type { QueueWorkerBuilderTypes } from '../QueueWorkerBuilder/QueueWorkerBuilderTypes.js'
import {
	createQueuedHarnessTargetReference,
	registerHarnessTargetQueueBinding,
	requireHarnessTargetQueueBinding as requireRegisteredHarnessTargetQueueBinding,
	requireQueuedHarnessTargetReference as requireRegisteredQueuedHarnessTargetReference,
} from './queueReferenceRegistry.js'

export type { QueuedHarnessTargetReference } from './queueReferenceRegistry.js'

import type { QueuedHarnessTargetReference } from './queueReferenceRegistry.js'

/** Opaque native queue and worker binding dedicated to one mounted Harness target. */
export type HarnessTargetQueueBinding<
	C extends AnyHarnessTargetContract,
	QueueName extends string = string,
	Queue = QueueDefinitionBuilder<QueueName>,
	Worker = QueueWorkerBuilder<QueueWorkerBuilderTypes, QueueName>,
> = Readonly<{
	targetContract: C
	reference: QueuedHarnessTargetReference<C, QueueName>
	queue: Queue
	worker: Worker
}>

type QueueBindingRecord = Readonly<{
	targetContract: AnyHarnessTargetContract
	reference: QueuedHarnessTargetReference<AnyHarnessTargetContract, string>
	queueName: string
	queue: QueueDefinitionBuilder
	worker: QueueWorkerBuilder
}>

/**
 * Bind a native queue and worker policy to one exact Harness target contract.
 *
 * The returned nominal `reference` is the only value that later queue-aware
 * declaration builders accept. The original target contract remains unchanged.
 */
export function defineHarnessQueueBinding<
	const C extends AnyHarnessTargetContract,
	const Queue extends QueueDefinitionBuilder<string>,
	const Worker extends QueueWorkerBuilder<QueueWorkerBuilderTypes, Queue['queueName']>,
>(contract: C, queue: Queue, worker: Worker): HarnessTargetQueueBinding<C, Queue['queueName'], Queue, Worker> {
	if (!isHarnessTargetContract(contract)) {
		throw new TypeError('Harness queue binding requires an authentic Harness target contract.')
	}
	if (queue.queueName !== worker.queueName) {
		throw new TypeError(`Harness queue binding names differ: "${queue.queueName}" and "${worker.queueName}".`)
	}
	if (queue.queueName.trim() === '') {
		throw new TypeError('Harness queue binding requires a non-empty queue name.')
	}

	const reference = createQueuedHarnessTargetReference(contract, queue.queueName)
	const binding = Object.freeze({ targetContract: contract, reference, queue, worker })
	registerHarnessTargetQueueBinding(binding, reference, queue, worker)
	return binding
}

/** @internal Resolve one exact factory-created binding for projection. */
export function requireHarnessTargetQueueBinding(
	value: unknown,
	targetContract: AnyHarnessTargetContract,
): QueueBindingRecord {
	return requireRegisteredHarnessTargetQueueBinding(value, targetContract) as QueueBindingRecord
}

/** @internal Resolve one exact factory-created nominal reference for declaration builders. */
export function requireQueuedHarnessTargetReference(
	value: unknown,
	targetContract?: AnyHarnessTargetContract,
): QueueBindingRecord {
	return requireRegisteredQueuedHarnessTargetReference(value, targetContract) as QueueBindingRecord
}
