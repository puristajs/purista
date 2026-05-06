import type { DefinitionQueueBridgeConfig } from '../core/types/DefinitionQueueBridgeConfig.js'
import { defaultQueueLifecycleConfig } from '../core/types/queue/defaultQueueLifecycleConfig.js'
import type { QueueDefinition } from '../core/types/queue/QueueDefinition.js'
import type { QueueLongRunningExecutionProfile } from '../core/types/queue/QueueExecutionProfile.js'
import type { QueueLifecycleConfig } from '../core/types/queue/QueueLifecycleConfig.js'
import type { QueueResultPolicy } from '../core/types/queue/QueueResultPolicy.js'
import type { QueueTransformHook } from '../core/types/queue/QueueTransformHook.js'
import type { QueueWorkerDefinition } from '../core/types/queue/QueueWorkerDefinition.js'
import type { ScheduleDefinition, ScheduleOptions } from '../core/types/schedule/index.js'
import type { Schema } from '../schema/index.js'

export class QueueDefinitionBuilder {
	private payloadSchema?: Schema
	private parameterSchema?: Schema
	private lifecycleConfig?: QueueLifecycleConfig
	private executionProfile?: QueueLongRunningExecutionProfile
	private resultPolicy?: QueueResultPolicy
	private schedules: ScheduleDefinition[] = []
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

	/**
	 * Apply the built-in long-running queue execution profile.
	 *
	 * @example
	 * ```ts
	 * queue.setExecutionProfile('longRunning', {
	 *   maxRuntimeMs: 6 * 60 * 60_000,
	 * })
	 * ```
	 */
	setExecutionProfile(profile: 'longRunning', options: { maxRuntimeMs: number; strict?: boolean }) {
		if (profile !== 'longRunning') {
			throw new Error(`unsupported queue execution profile "${profile}"`)
		}
		const visibilityTimeoutMs = 5 * 60_000
		const heartbeatIntervalMs = 60_000
		const maxLeaseExtensions = Math.max(1, Math.ceil(options.maxRuntimeMs / visibilityTimeoutMs) - 1)

		this.executionProfile = {
			name: profile,
			maxRuntimeMs: options.maxRuntimeMs,
			strict: options.strict,
			shutdown: { graceMs: 60_000, onTimeout: 'letLeaseExpire' },
			onLeaseLost: 'abort',
		}
		this.lifecycleConfig = {
			...defaultQueueLifecycleConfig,
			visibilityTimeoutMs,
			heartbeatIntervalMs,
			autoHeartbeat: true,
			maxLeaseExtensions,
			maxAttempts: 3,
			retryWindowMs: 24 * 60 * 60_000,
		}
		return this
	}

	/**
	 * Persist or emit queue worker completion metadata.
	 *
	 * @example
	 * ```ts
	 * queue.setResultPolicy({
	 *   mode: 'event',
	 *   successEventName: 'billing.monthlyClosing.completed',
	 * })
	 * ```
	 */
	setResultPolicy(policy: QueueResultPolicy) {
		this.resultPolicy = {
			delivery: 'best-effort',
			eventId: 'jobIdAndStatus',
			...policy,
		}
		return this
	}

	/**
	 * Convenience helper for emitting successful worker output as a PURISTA event.
	 */
	emitResultAsEvent(successEventName: string, options?: Omit<QueueResultPolicy, 'mode' | 'successEventName'>) {
		return this.setResultPolicy({
			mode: 'event',
			successEventName,
			...options,
		})
	}

	/**
	 * Mark this queue as a direct schedule target.
	 */
	markSchedulable(options: ScheduleOptions & { name: string; description?: string }) {
		this.schedules.push({
			name: options.name,
			description: options.description,
			targetKind: 'queue',
			targetName: this.queueName,
			payloadSchema: options.payloadSchema,
			parameterSchema: options.parameterSchema,
			expression: options.expression,
			timezone: options.timezone,
			concurrencyPolicy: options.concurrencyPolicy ?? 'allow',
			missedRunPolicy: options.missedRunPolicy ?? 'skip',
			maxCatchUpCount: options.maxCatchUpCount,
			jitterWindowMs: options.jitterWindowMs,
			idempotencyKey: options.idempotencyKey,
			enabledByDefault: options.enabledByDefault ?? true,
			providerHints: options.providerHints,
		})
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
			executionProfile: this.executionProfile,
			resultPolicy: this.resultPolicy,
			schedules: this.schedules,
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
