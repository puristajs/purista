export type InFlightExecutionKind = 'command' | 'subscription' | 'stream' | 'generic'
type InFlightExecutionCounts = Record<InFlightExecutionKind, number>

export class InFlightExecutionTracker {
	private readonly running = new Set<Promise<unknown>>()
	private readonly kinds = new Map<InFlightExecutionKind, number>()

	get size() {
		return this.running.size
	}

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

	getCounts() {
		const counts: InFlightExecutionCounts = {
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
