import type { AnyHarnessTargetContract } from '@purista/harness'

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

type QueueNameCarrier = Readonly<{ queueName: string }>

/** @internal Authentic queue binding record, independent from PURISTA builder classes. */
export type HarnessQueueReferenceRecord = Readonly<{
	targetContract: AnyHarnessTargetContract
	reference: QueuedHarnessTargetReference<AnyHarnessTargetContract, string>
	queueName: string
	queue: QueueNameCarrier
	worker: QueueNameCarrier
}>

const authenticQueueReferences = new WeakMap<object, HarnessQueueReferenceRecord>()
const authenticQueueBindings = new WeakMap<object, HarnessQueueReferenceRecord>()

/** @internal Create the nominal reference retained by the local authenticity registry. */
export function createQueuedHarnessTargetReference<C extends AnyHarnessTargetContract, QueueName extends string>(
	contract: C,
	queueName: QueueName,
): QueuedHarnessTargetReference<C, QueueName> {
	return new QueuedHarnessTargetReferenceAuthenticity(contract, queueName)
}

/** @internal Register the exact facade-created binding and its nominal reference. */
export function registerHarnessTargetQueueBinding(
	binding: object,
	reference: QueuedHarnessTargetReference<AnyHarnessTargetContract, string>,
	queue: QueueNameCarrier,
	worker: QueueNameCarrier,
): void {
	const record: HarnessQueueReferenceRecord = Object.freeze({
		targetContract: reference.contract,
		reference,
		queueName: reference.queue.name,
		queue,
		worker,
	})
	authenticQueueReferences.set(reference, record)
	authenticQueueBindings.set(binding, record)
}

/** @internal Resolve one exact facade-created binding for projection. */
export function requireHarnessTargetQueueBinding(
	value: unknown,
	targetContract: AnyHarnessTargetContract,
): HarnessQueueReferenceRecord {
	if (typeof value !== 'object' || value === null) throw invalidQueueBinding()
	const record = authenticQueueBindings.get(value)
	assertQueueRecord(record, targetContract)
	return record
}

/** @internal Resolve one exact facade-created nominal reference for declaration builders. */
export function requireQueuedHarnessTargetReference(
	value: unknown,
	targetContract?: AnyHarnessTargetContract,
): HarnessQueueReferenceRecord {
	if (typeof value !== 'object' || value === null) throw invalidQueueBinding()
	const record = authenticQueueReferences.get(value)
	assertQueueRecord(record, targetContract ?? record?.targetContract)
	return record
}

function assertQueueRecord(
	record: HarnessQueueReferenceRecord | undefined,
	targetContract: AnyHarnessTargetContract | undefined,
): asserts record is HarnessQueueReferenceRecord {
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
