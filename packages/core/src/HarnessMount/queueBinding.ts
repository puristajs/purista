import type { HarnessTargetContract } from '@purista/harness'

import type { QueueDefinitionBuilder } from '../QueueDefinitionBuilder/QueueDefinitionBuilder.impl.js'
import type { QueueWorkerBuilder } from '../QueueWorkerBuilder/QueueWorkerBuilder.impl.js'
import type { HarnessTargetQueueBinding, QueuedHarnessTargetContract } from './types.js'

/**
 * Bind a native queue and worker policy to one Harness target contract.
 *
 * The mounted integration supplies the queue payload schema and worker handler.
 * Callers use `binding.contract` to receive typed `.enqueue(...)` access.
 *
 * @example
 * ```ts
 * const queuedAnswer = defineHarnessQueueBinding(
 *   supportHarness.contracts.agents.answer,
 *   serviceBuilder.getQueueBuilder('support.answer', 'Queue support answers'),
 *   serviceBuilder.getQueueWorkerBuilder('support.answer', 'answer-worker').setMaxParallelHandlers(3),
 * )
 * ```
 */
export function defineHarnessQueueBinding<const C extends HarnessTargetContract<any, any, any, any, any>>(
	contract: C,
	queue: QueueDefinitionBuilder,
	worker: QueueWorkerBuilder,
): HarnessTargetQueueBinding<C, QueueDefinitionBuilder, QueueWorkerBuilder> {
	if (queue.queueName !== worker.queueName) {
		throw new TypeError(`Harness queue binding names differ: "${queue.queueName}" and "${worker.queueName}".`)
	}
	const queuedContract = Object.freeze({
		...contract,
		queue: Object.freeze({ name: queue.queueName }),
	}) as QueuedHarnessTargetContract<C>
	return Object.freeze({ contract: queuedContract, targetContract: contract, queue, worker })
}
