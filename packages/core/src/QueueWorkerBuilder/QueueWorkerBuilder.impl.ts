import { getNamedHook, mergeNamedHooks } from '../core/helper/builderRegistry.impl.js'
import type { QueueWorkerAfterGuardHook } from '../core/types/queue/QueueWorkerAfterGuardHook.js'
import type { QueueWorkerBeforeGuardHook } from '../core/types/queue/QueueWorkerBeforeGuardHook.js'
import type {
	QueueWorkerDefinition,
	QueueWorkerHandler,
	QueueWorkerMode,
} from '../core/types/queue/QueueWorkerDefinition.js'

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

	setMode(mode: QueueWorkerMode) {
		this.mode = mode
		return this
	}

	setIntervalMs(intervalMs: number) {
		this.intervalMs = intervalMs
		return this
	}

	setMaxParallelHandlers(count: number) {
		this.maxParallelHandlers = count
		return this
	}

	setHandler(handler: QueueWorkerHandler) {
		this.handler = handler
		return this
	}

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
