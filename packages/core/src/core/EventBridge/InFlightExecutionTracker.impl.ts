export class InFlightExecutionTracker {
	private readonly running = new Set<Promise<unknown>>()

	get size() {
		return this.running.size
	}

	run<T>(fn: () => Promise<T>): Promise<T> {
		const promise = Promise.resolve().then(fn)
		this.running.add(promise)
		void promise
			.finally(() => {
				this.running.delete(promise)
			})
			.catch(() => undefined)
		return promise
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
