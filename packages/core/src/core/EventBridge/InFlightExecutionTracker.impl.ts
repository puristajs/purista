/**
 * Work kind tracked during event bridge drain and diagnostics.
 *
 * @group Event bridge
 */
export type InFlightExecutionKind = 'command' | 'subscription' | 'stream' | 'generic'
/**
 * In-flight execution counts grouped by work kind.
 *
 * @group Event bridge
 */
export type EventBridgeInFlightExecutionCounts = Record<InFlightExecutionKind, number>

/**
 * Tracks active event bridge handler promises for drain and health reporting.
 *
 * The tracker does not cancel work. It observes when work settles so shutdown
 * code can wait for in-flight commands, subscriptions, streams, and generic
 * tasks to finish within a grace period.
 *
 * @group Event bridge
 */
export class InFlightExecutionTracker {
	private readonly running = new Set<Promise<unknown>>()
	private readonly kinds = new Map<InFlightExecutionKind, number>()

	/** Number of currently running executions. */
	get size() {
		return this.running.size
	}

	/** Run and track one asynchronous execution. */
	run<T>(fn: () => Promise<T>, kind: InFlightExecutionKind = 'generic'): Promise<T> {
		const promise = Promise.resolve().then(fn)
		this.running.add(promise)
		this.kinds.set(kind, (this.kinds.get(kind) ?? 0) + 1)
		void promise
			.finally(() => {
				this.running.delete(promise)
				const next = (this.kinds.get(kind) ?? 1) - 1
				if (next <= 0) {
					this.kinds.delete(kind)
				} else {
					this.kinds.set(kind, next)
				}
			})
			.catch(() => undefined)
		return promise
	}

	/** Return active execution counts grouped by kind. */
	getCounts(): EventBridgeInFlightExecutionCounts {
		const counts: EventBridgeInFlightExecutionCounts = {
			command: 0,
			subscription: 0,
			stream: 0,
			generic: 0,
		}
		for (const [kind, value] of this.kinds.entries()) {
			counts[kind] = value
		}
		return counts
	}

	/**
	 * Wait until all tracked work settles or the timeout elapses.
	 *
	 * @returns `true` when idle, `false` when the timeout elapsed.
	 */
	async waitForIdle(timeoutMs: number): Promise<boolean> {
		if (this.running.size <= 0) {
			return true
		}

		const startedAt = Date.now()
		while (this.running.size > 0) {
			if (Date.now() - startedAt >= timeoutMs) {
				return false
			}
			await new Promise(resolve => setTimeout(resolve, 10))
		}

		return true
	}
}
