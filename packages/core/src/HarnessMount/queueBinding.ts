import type { AnyHarnessTargetContract } from '@purista/harness'
import { isHarnessTargetContract } from '@purista/harness/integrator'

import type { QueueDefinitionBuilder } from '../QueueDefinitionBuilder/QueueDefinitionBuilder.impl.js'
import type { QueueWorkerBuilder } from '../QueueWorkerBuilder/QueueWorkerBuilder.impl.js'
import type { QueueWorkerBuilderTypes } from '../QueueWorkerBuilder/QueueWorkerBuilderTypes.js'

class QueuedHarnessTargetReferenceAuthenticity<C extends AnyHarnessTargetContract, QueueName extends string> {
	private declare readonly authenticity: undefined
	public readonly contract: C
	public readonly queue: Readonly<{ name: QueueName }>

	public constructor(contract: C, queueName: QueueName) {
		this.contract = contract
		this.queue = Object.freeze({ name: queueName })
		Object.freeze(this)
	}
}

/** Nominal reference that adds queue declaration authority to one exact local target. */
export type QueuedHarnessTargetReference<
	C extends AnyHarnessTargetContract,
	QueueName extends string,
> = QueuedHarnessTargetReferenceAuthenticity<C, QueueName>

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

const authenticQueueReferences = new WeakMap<object, QueueBindingRecord>()
const authenticQueueBindings = new WeakMap<object, QueueBindingRecord>()

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

	const reference = new QueuedHarnessTargetReferenceAuthenticity(contract, queue.queueName)
	const binding = Object.freeze({ targetContract: contract, reference, queue, worker })
	const record: QueueBindingRecord = Object.freeze({
		targetContract: contract,
		reference,
		queueName: queue.queueName,
		queue,
		worker,
	})
	authenticQueueReferences.set(reference, record)
	authenticQueueBindings.set(binding, record)
	return binding
}

/** @internal Resolve one exact factory-created binding for projection. */
export function requireHarnessTargetQueueBinding(
	value: unknown,
	targetContract: AnyHarnessTargetContract,
): QueueBindingRecord {
	if (typeof value !== 'object' || value === null) throw invalidQueueBinding()
	const record = authenticQueueBindings.get(value)
	assertQueueRecord(record, targetContract)
	return record
}

/** @internal Resolve one exact factory-created nominal reference for declaration builders. */
export function requireQueuedHarnessTargetReference(
	value: unknown,
	targetContract?: AnyHarnessTargetContract,
): QueueBindingRecord {
	if (typeof value !== 'object' || value === null) throw invalidQueueBinding()
	const record = authenticQueueReferences.get(value)
	assertQueueRecord(record, targetContract ?? record?.targetContract)
	return record
}

function assertQueueRecord(
	record: QueueBindingRecord | undefined,
	targetContract: AnyHarnessTargetContract | undefined,
): asserts record is QueueBindingRecord {
	if (
		record === undefined ||
		targetContract === undefined ||
		record.targetContract !== targetContract ||
		record.reference.contract !== targetContract ||
		record.reference.queue.name !== record.queueName ||
		record.queue.queueName !== record.queueName ||
		record.worker.queueName !== record.queueName ||
		authenticQueueReferences.get(record.reference) !== record
	) {
		throw invalidQueueBinding()
	}
}

function invalidQueueBinding(): TypeError {
	return new TypeError('Harness target queue binding is not the exact factory-created binding for this contract.')
}
