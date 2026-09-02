import type { DefinitionQueueBridgeConfig } from '../core/types/DefinitionQueueBridgeConfig.js'
import { defaultQueueLifecycleConfig } from '../core/types/queue/defaultQueueLifecycleConfig.js'
import type { QueueDefinition } from '../core/types/queue/QueueDefinition.js'
import type { QueueLongRunningExecutionProfile } from '../core/types/queue/QueueExecutionProfile.js'
import type { QueueLifecycleConfig } from '../core/types/queue/QueueLifecycleConfig.js'
import type { QueueResultPolicy } from '../core/types/queue/QueueResultPolicy.js'
import type { QueueTransformHook } from '../core/types/queue/QueueTransformHook.js'
import type { AnyQueueWorkerDefinition } from '../core/types/queue/QueueWorkerDefinitionList.js'
import type { ScheduleDefinition, ScheduleOptions } from '../core/types/schedule/index.js'
import type { Schema } from '../schema/index.js'

/**
 * Builds a durable queue contract for background work.
 *
 * Queue definitions describe schemas, retry/lease behavior, result side
 * effects, worker bindings, and optional schedules. Runtime queue semantics are
 * provided by the configured queue bridge.
 *
 * @example
 * ```ts
 * const queue = service
 *   .getQueueBuilder('billing.monthlyClosing', 'Close monthly billing')
 *   .addPayloadSchema(monthlyClosingSchema)
 *   .setLifecycleConfig({ maxAttempts: 5 })
 *   .emitResultAsEvent('billing.monthlyClosing.completed')
 * ```
 */
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
	private workers: AnyQueueWorkerDefinition[] = []
	private deadLetter?: { queueName?: string }
	private queueBridgeConfig: DefinitionQueueBridgeConfig = {
		prefetch: 1,
		orderingGuarantee: 'fifo',
	}

	constructor(
		public readonly queueName: string,
		private readonly queueDescription: string,
	) {}

	/** Add the queue job payload schema used during enqueue and worker execution. */
	addPayloadSchema(schema: Schema) {
		this.payloadSchema = schema
		return this
	}

	/** Add the queue job parameter schema used during enqueue and worker execution. */
	addParameterSchema(schema: Schema) {
		this.parameterSchema = schema
		return this
	}

	/** Override queue retry, lease, heartbeat, delay, and retention lifecycle defaults. */
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

	/**
	 * Transform or normalize a job before it is sent to the queue bridge.
	 *
	 * @example
	 * ```ts
	 * queue.setBeforeEnqueueTransform(async job => ({
	 *   ...job,
	 *   parameter: { ...job.parameter, requestedAt: Date.now() },
	 * }))
	 * ```
	 */
	setBeforeEnqueueTransform(transform: QueueTransformHook) {
		this.beforeEnqueueTransform = transform
		return this
	}

	/** Transform or enrich a stored job immediately before worker execution. */
	setBeforeExecuteTransform(transform: QueueTransformHook) {
		this.beforeExecuteTransform = transform
		return this
	}

	/** Configure where failed jobs are dead-lettered when the queue bridge supports it. */
	setDeadLetterOptions(options: { queueName?: string }) {
		this.deadLetter = options
		return this
	}

	/** Set tags used by tooling and generated queue metadata. */
	setTags(tags: string[]) {
		this.tags = tags
		return this
	}

	/** Mark this queue definition as deprecated in generated metadata. */
	markAsDeprecated() {
		this.deprecated = true
		return this
	}

	/** Configure queue bridge delivery hints such as prefetch and ordering guarantee. */
	setQueueBridgeConfig(config: Partial<DefinitionQueueBridgeConfig>) {
		this.queueBridgeConfig = {
			...this.queueBridgeConfig,
			...config,
		}
		return this
	}

	/** Attach one or more worker definitions that can process jobs from this queue. */
	addWorkerDefinition(...workers: AnyQueueWorkerDefinition[]) {
		this.workers.push(...workers)
		return this
	}

	/** Resolve this builder into the queue definition consumed by a service. */
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
