import type { Schema } from '../schema/index.js'
import type { DefinitionEventBridgeConfig } from '../core/types/DefinitionEventBridgeConfig.js'
import type { QueueDefinition } from '../core/types/queue/QueueDefinition.js'
import type { QueueLifecycleConfig } from '../core/types/queue/QueueLifecycleConfig.js'
import type { QueueWorkerDefinition } from '../core/types/queue/QueueWorkerDefinition.js'
import type { QueueTransformHook } from '../core/types/queue/QueueTransformHook.js'
import { defaultQueueLifecycleConfig } from '../core/types/queue/defaultQueueLifecycleConfig.js'

export class QueueDefinitionBuilder {
	private payloadSchema?: Schema
	private parameterSchema?: Schema
	private lifecycleConfig?: QueueLifecycleConfig
	private beforeEnqueueTransform?: QueueTransformHook
	private beforeExecuteTransform?: QueueTransformHook
	private tags: string[] = []
	private deprecated = false
	private workers: QueueWorkerDefinition[] = []
	private deadLetter?: { queueName?: string; eventName?: string; emitEvent?: boolean }
	private eventBridgeConfig: DefinitionEventBridgeConfig = {
		autoacknowledge: false,
		durable: true,
		shared: true,
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

	setDeadLetterOptions(options: { queueName?: string; eventName?: string; emitEvent?: boolean }) {
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

	setEventBridgeConfig(config: DefinitionEventBridgeConfig) {
		this.eventBridgeConfig = config
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
			eventBridgeConfig: this.eventBridgeConfig,
			workers: this.workers,
			deadLetter: this.deadLetter
				? {
						queueName: this.deadLetter.queueName,
						eventName: this.deadLetter.eventName,
						emitEvent: this.deadLetter.emitEvent,
				  }
				: undefined,
			transformBeforeEnqueue: this.beforeEnqueueTransform,
			transformBeforeExecute: this.beforeExecuteTransform,
		}
	}
}
