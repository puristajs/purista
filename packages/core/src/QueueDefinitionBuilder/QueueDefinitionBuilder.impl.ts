import type { DefinitionQueueBridgeConfig } from '../core/types/DefinitionQueueBridgeConfig.js'
import { defaultQueueLifecycleConfig } from '../core/types/queue/defaultQueueLifecycleConfig.js'
import type { QueueDefinition } from '../core/types/queue/QueueDefinition.js'
import type { QueueLifecycleConfig } from '../core/types/queue/QueueLifecycleConfig.js'
import type { QueueTransformHook } from '../core/types/queue/QueueTransformHook.js'
import type { QueueWorkerDefinition } from '../core/types/queue/QueueWorkerDefinition.js'
import type { Schema } from '../schema/index.js'

export class QueueDefinitionBuilder {
	private payloadSchema?: Schema
	private parameterSchema?: Schema
	private lifecycleConfig?: QueueLifecycleConfig
	private beforeEnqueueTransform?: QueueTransformHook
	private beforeExecuteTransform?: QueueTransformHook
	private tags: string[] = []
	private deprecated = false
	private workers: QueueWorkerDefinition[] = []
	private deadLetter?: { queueName?: string }
	private queueBridgeConfig: DefinitionQueueBridgeConfig = {
		prefetch: 1,
		orderingGuarantee: 'fifo',
	}

	constructor(
		private readonly queueName: string,
		private readonly queueDescription: string,
	) {}

	addPayloadSchema(schema: Schema) {
		this.payloadSchema = schema
		return this
	}

	addParameterSchema(schema: Schema) {
		this.parameterSchema = schema
		return this
	}

	setLifecycleConfig(config: Partial<QueueLifecycleConfig>) {
		this.lifecycleConfig = {
			...defaultQueueLifecycleConfig,
			...config,
		}
		return this
	}

	setBeforeEnqueueTransform(transform: QueueTransformHook) {
		this.beforeEnqueueTransform = transform
		return this
	}

	setBeforeExecuteTransform(transform: QueueTransformHook) {
		this.beforeExecuteTransform = transform
		return this
	}

	setDeadLetterOptions(options: { queueName?: string }) {
		this.deadLetter = options
		return this
	}

	setTags(tags: string[]) {
		this.tags = tags
		return this
	}

	markAsDeprecated() {
		this.deprecated = true
		return this
	}

	setQueueBridgeConfig(config: Partial<DefinitionQueueBridgeConfig>) {
		this.queueBridgeConfig = {
			...this.queueBridgeConfig,
			...config,
		}
		return this
	}

	addWorkerDefinition(...workers: QueueWorkerDefinition[]) {
		this.workers.push(...workers)
		return this
	}

	async getDefinition(): Promise<QueueDefinition> {
		const lifecycle = this.lifecycleConfig ?? defaultQueueLifecycleConfig

		return {
			queueName: this.queueName,
			description: this.queueDescription,
			payloadSchema: this.payloadSchema,
			parameterSchema: this.parameterSchema,
			lifecycle: { ...lifecycle },
			tags: this.tags,
			deprecated: this.deprecated,
			queueBridgeConfig: this.queueBridgeConfig,
			workers: this.workers,
			deadLetter: this.deadLetter
				? {
						queueName: this.deadLetter.queueName,
					}
				: undefined,
			transformBeforeEnqueue: this.beforeEnqueueTransform,
			transformBeforeExecute: this.beforeExecuteTransform,
		}
	}
}
