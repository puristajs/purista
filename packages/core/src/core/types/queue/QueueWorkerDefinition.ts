import type { AllowedAgentDefinition } from '../../../AgentQueueBuilder/types.js'
import type { InferIn, Schema } from '../../../schema/index.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { PuristaMetricDefinitions } from '../PuristaMetrics.js'
import type { ServiceClass } from '../ServiceClass.js'
import type { StreamInvokeList } from '../StreamInvokeList.js'
import type { QueueHandlerResult } from './QueueHandlerResult.js'
import type { QueueInvokeList } from './QueueInvokeList.js'
import type { QueueJobContext } from './QueueJobContext.js'
import type { QueueMessage } from './QueueMessage.js'
import type { QueueWorkerAfterGuardHook } from './QueueWorkerAfterGuardHook.js'
import type { QueueWorkerBeforeGuardHook } from './QueueWorkerBeforeGuardHook.js'

/**
 * Queue worker polling mode.
 *
 * @group Queue
 */
export type QueueWorkerMode = 'continuous' | 'interval' | 'sequential'

/**
 * Function that processes one leased queue message.
 *
 * Handlers should be idempotent because retries, lease expiry, and redrive can
 * execute the same business work more than once.
 *
 * @group Queue
 */
export type QueueWorkerHandler<
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = Record<string, never>,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
	Metrics extends PuristaMetricDefinitions = EmptyObject,
	AgentInvokes extends Record<string, AllowedAgentDefinition> = Record<never, never>,
> = (
	context: QueueJobContext<
		MessagePayloadType,
		MessageParamsType,
		Resources,
		Invokes,
		StreamInvokes,
		EmitList,
		QueueInvokes,
		Metrics,
		AgentInvokes
	>,
	message: QueueMessage<MessagePayloadType, MessageParamsType>,
) => Promise<QueueHandlerResult | undefined>

/**
 * Public definition of a worker attached to a queue.
 *
 * @group Queue
 */
export type QueueWorkerDefinition<
	PayloadSchema extends Schema = Schema,
	ParamsSchema extends Schema = Schema,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = Record<string, never>,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
	Metrics extends PuristaMetricDefinitions = EmptyObject,
	AgentInvokes extends Record<string, AllowedAgentDefinition> = Record<never, never>,
> = {
	/** Worker name used in diagnostics and metrics. */
	name: string
	/** Queue name this worker leases from. */
	queueName: string
	/** Polling/execution mode. */
	mode: QueueWorkerMode
	/** Poll interval for interval-based workers. */
	intervalMs?: number
	/** Maximum concurrently leased messages for this worker. */
	maxParallelHandlers: number
	/** Business handler for leased messages. */
	handler: QueueWorkerHandler<
		PayloadSchema,
		ParamsSchema,
		Resources,
		Invokes,
		StreamInvokes,
		EmitList,
		QueueInvokes,
		Metrics,
		AgentInvokes
	>
	/** Commands this worker may invoke through the typed service proxy. */
	invokes: Invokes
	/** Streams this worker may consume through the typed stream proxy. */
	streamInvokes: StreamInvokes
	/** Custom events this worker may emit. */
	emitList: EmitList
	/** Queues this worker may enqueue. */
	queueInvokes: QueueInvokes
	/** Same-service agents this worker may invoke through the typed agent proxy. */
	agentInvokes: readonly AllowedAgentDefinition[]
	/** Guards that run before the worker handler. */
	beforeGuards?: Record<
		string,
		QueueWorkerBeforeGuardHook<
			ServiceClass,
			InferIn<PayloadSchema>,
			InferIn<ParamsSchema>,
			Resources,
			Invokes,
			StreamInvokes
		>
	>
	/** Guards that run after the worker handler. */
	afterGuards?: Record<
		string,
		QueueWorkerAfterGuardHook<
			ServiceClass,
			InferIn<PayloadSchema>,
			InferIn<ParamsSchema>,
			Resources,
			Invokes,
			StreamInvokes
		>
	>
}
