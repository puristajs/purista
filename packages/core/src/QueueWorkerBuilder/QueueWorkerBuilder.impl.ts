import { assertNonArrowFunction } from '../core/helper/assertNonArrowFunction.impl.js'
import type {
	QueueWorkerDefinition,
	QueueWorkerHandler,
	QueueWorkerMode,
} from '../core/types/queue/QueueWorkerDefinition.js'
import type { QueueWorkerBeforeGuardHook } from '../core/types/queue/QueueWorkerBeforeGuardHook.js'
import type { QueueWorkerAfterGuardHook } from '../core/types/queue/QueueWorkerAfterGuardHook.js'

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
		for (const [name, hook] of Object.entries(hooks)) {
			assertNonArrowFunction(hook, `setBeforeGuardHooks.${name}`)
		}
		this.beforeGuards = { ...this.beforeGuards, ...hooks }
		return this
	}

	setAfterGuardHooks(hooks: Record<string, QueueWorkerAfterGuardHook>) {
		for (const [name, hook] of Object.entries(hooks)) {
			assertNonArrowFunction(hook, `setAfterGuardHooks.${name}`)
		}
		this.afterGuards = { ...this.afterGuards, ...hooks }
		return this
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
