import { getNamedHook, mergeNamedHooks } from '../core/helper/builderRegistry.impl.js'
import type { QueueWorkerAfterGuardHook } from '../core/types/queue/QueueWorkerAfterGuardHook.js'
import type { QueueWorkerBeforeGuardHook } from '../core/types/queue/QueueWorkerBeforeGuardHook.js'
import type {
	QueueWorkerDefinition,
	QueueWorkerHandler,
	QueueWorkerMode,
} from '../core/types/queue/QueueWorkerDefinition.js'

/**
 * Builds a queue worker definition for one queue.
 *
 * A worker owns execution behavior for queued jobs. The queue definition owns
 * durability and lifecycle policy; this builder owns handler concurrency,
 * worker mode, and guard hooks.
 *
 * @example
 * ```ts
 * const worker = service
 *   .getQueueWorkerBuilder('billing.monthlyClosing', 'close-month')
 *   .setMaxParallelHandlers(2)
 *   .setHandler(async (context, job) => ({ status: 'success', output: job.payload }))
 * ```
 */
export class QueueWorkerBuilder {
	private mode: QueueWorkerMode = 'continuous'
	private intervalMs?: number
	private maxParallelHandlers = 1
	private handler?: QueueWorkerHandler
	private beforeGuards: Record<string, QueueWorkerBeforeGuardHook> = {}
	private afterGuards: Record<string, QueueWorkerAfterGuardHook> = {}

	constructor(
		private readonly queueName: string,
		private readonly workerName: string,
	) {}

	/** Set whether the worker runs continuously or in a bridge-supported polling mode. */
	setMode(mode: QueueWorkerMode) {
		this.mode = mode
		return this
	}

	/** Set the polling interval for worker modes that use intervals. */
	setIntervalMs(intervalMs: number) {
		this.intervalMs = intervalMs
		return this
	}

	/** Set how many jobs this worker may process concurrently. */
	setMaxParallelHandlers(count: number) {
		this.maxParallelHandlers = count
		return this
	}

	/** Set the job handler implementation for this worker. */
	setHandler(handler: QueueWorkerHandler) {
		this.handler = handler
		return this
	}

	/** Register named guard hooks that run before the worker handler. */
	setBeforeGuardHooks(hooks: Record<string, QueueWorkerBeforeGuardHook>) {
		this.beforeGuards = mergeNamedHooks(this.beforeGuards, hooks, 'setBeforeGuardHooks')
		return this
	}

	/**
	 * Return a previously registered before-guard hook by name.
	 */
	getBeforeGuardHook(name: keyof typeof this.beforeGuards) {
		return getNamedHook(this.beforeGuards, name)
	}

	/** Register named guard hooks that run after the worker handler. */
	setAfterGuardHooks(hooks: Record<string, QueueWorkerAfterGuardHook>) {
		this.afterGuards = mergeNamedHooks(this.afterGuards, hooks, 'setAfterGuardHooks')
		return this
	}

	/**
	 * Return a previously registered after-guard hook by name.
	 */
	getAfterGuardHook(name: keyof typeof this.afterGuards) {
		return getNamedHook(this.afterGuards, name)
	}

	/** Resolve this builder into the queue worker definition consumed by a service. */
	async getDefinition(): Promise<QueueWorkerDefinition> {
		if (!this.handler) {
			throw new Error('QueueWorkerBuilder: missing handler implementation')
		}

		return {
			name: this.workerName,
			queueName: this.queueName,
			mode: this.mode,
			intervalMs: this.intervalMs,
			maxParallelHandlers: this.maxParallelHandlers,
			handler: this.handler,
			beforeGuards: this.beforeGuards,
			afterGuards: this.afterGuards,
		}
	}
}
