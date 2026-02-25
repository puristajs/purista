import type { Infer, Schema } from '../../../schema/index.js'
import type { DefinitionQueueBridgeConfig } from '../DefinitionQueueBridgeConfig.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { StreamInvokeList } from '../StreamInvokeList.js'
import type { ServiceClass } from '../ServiceClass.js'
import type { QueueLifecycleConfig } from './QueueLifecycleConfig.js'
import type { QueueWorkerDefinition } from './QueueWorkerDefinition.js'
import type { QueueTransformHook } from './QueueTransformHook.js'

export type QueueDefinition<
	PayloadSchema extends Schema = Schema,
	ParamsSchema extends Schema = Schema,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
> = {
	queueName: string
	description: string
	payloadSchema?: PayloadSchema
	parameterSchema?: ParamsSchema
	tags: string[]
	deprecated: boolean
	lifecycle?: QueueLifecycleConfig
	queueBridgeConfig: DefinitionQueueBridgeConfig
	workers: QueueWorkerDefinition<PayloadSchema, ParamsSchema, Resources, Invokes, StreamInvokes>[]
	deadLetter?: {
		queueName?: string
		eventName?: string
		emitEvent?: boolean
	}
	transformBeforeEnqueue?: QueueTransformHook<
		ServiceClass,
		Infer<PayloadSchema>,
		Infer<ParamsSchema>,
		Resources
	>
	transformBeforeExecute?: QueueTransformHook<
		ServiceClass,
		Infer<PayloadSchema>,
		Infer<ParamsSchema>,
		Resources
	>
}
