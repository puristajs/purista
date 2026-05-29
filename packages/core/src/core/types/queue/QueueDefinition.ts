import type { Infer, Schema } from '../../../schema/index.js'
import type { DefinitionQueueBridgeConfig } from '../DefinitionQueueBridgeConfig.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { ServiceClass } from '../ServiceClass.js'
import type { StreamInvokeList } from '../StreamInvokeList.js'
import type { ScheduleDefinition } from '../schedule/index.js'
import type { QueueLongRunningExecutionProfile } from './QueueExecutionProfile.js'
import type { QueueLifecycleConfig } from './QueueLifecycleConfig.js'
import type { QueueResultPolicy } from './QueueResultPolicy.js'
import type { QueueTransformHook } from './QueueTransformHook.js'
import type { QueueWorkerDefinition } from './QueueWorkerDefinition.js'

/**
 * Public definition of a queue contract attached to a PURISTA service.
 *
 * Queue definitions describe durable background work: schemas, retry
 * lifecycle, result publication, schedules, bridge requirements, workers, and
 * optional transforms. The service runtime validates payload and parameter
 * schemas before enqueue and before worker execution.
 *
 * @group Queue
 */
export type QueueDefinition<
	PayloadSchema extends Schema = Schema,
	ParamsSchema extends Schema = Schema,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
> = {
	/** Stable queue name used for enqueueing and worker registration. */
	queueName: string
	/** Human-readable queue purpose for generated docs. */
	description: string
	/** Optional payload schema used for runtime validation and OpenAPI export. */
	payloadSchema?: PayloadSchema
	/** Optional parameter schema used for runtime validation and OpenAPI export. */
	parameterSchema?: ParamsSchema
	/** Searchable tags for generated docs. */
	tags: string[]
	/** Marks this queue contract as deprecated in generated docs. */
	deprecated: boolean
	/** Retry, lease, heartbeat, and poison-message policy. */
	lifecycle?: QueueLifecycleConfig
	/** Runtime profile for long-running handlers. */
	executionProfile?: QueueLongRunningExecutionProfile
	/** Optional result event/state publication policy. */
	resultPolicy?: QueueResultPolicy
	/** External schedule contracts targeting this queue. */
	schedules?: ScheduleDefinition[]
	/** Required queue bridge capabilities for strict startup validation. */
	queueBridgeConfig: DefinitionQueueBridgeConfig
	/** Worker definitions that process messages from this queue. */
	workers: QueueWorkerDefinition<PayloadSchema, ParamsSchema, Resources, Invokes, StreamInvokes>[]
	/** Optional dead-letter queue naming override. */
	deadLetter?: {
		queueName?: string
	}
	/** Transform hook executed before enqueueing a message. */
	transformBeforeEnqueue?: QueueTransformHook<ServiceClass, Infer<PayloadSchema>, Infer<ParamsSchema>, Resources>
	/** Transform hook executed before worker handler execution. */
	transformBeforeExecute?: QueueTransformHook<ServiceClass, Infer<PayloadSchema>, Infer<ParamsSchema>, Resources>
}
