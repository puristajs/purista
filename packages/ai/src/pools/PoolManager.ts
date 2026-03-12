type PoolState = {
	active: number
	max: number
	waiting: Array<() => void>
}

export type PoolStats = {
	id: string
	activeWorkers: number
	waitingWorkers: number
	maxConcurrencyPerInstance: number
}

export type PoolAcquireResult = PoolStats & {
	waitTimeMs: number
}

/**
 * Tracks concurrency pools for background agents so hosts can guard rate limits and costs.
 *
 * @example
 * ```ts
 * const pools = new PoolManager({ default: 2 })
 * await pools.acquire('default')
 * // ... perform work ...
 * pools.release('default')
 * ```
 */
export class PoolManager {
	private readonly pools = new Map<string, PoolState>()

	constructor(initial?: Record<string, number>) {
		if (initial) {
			for (const [id, max] of Object.entries(initial)) {
				this.pools.set(id, { active: 0, max, waiting: [] })
			}
		}
	}

	registerPool(id: string, maxParallel: number) {
		const normalizedMax = Math.max(1, Math.trunc(maxParallel))
		const existing = this.pools.get(id)
		if (existing) {
			existing.max = normalizedMax
			return
		}
		this.pools.set(id, { active: 0, max: normalizedMax, waiting: [] })
	}

	async acquire(id: string): Promise<PoolAcquireResult> {
		const pool = this.ensurePool(id)
		const requestedAt = Date.now()
		if (pool.active < pool.max) {
			pool.active += 1
			return {
				...this.getPoolStats(id),
				waitTimeMs: 0,
			}
		}
		await new Promise<void>(resolve => {
			pool.waiting.push(() => {
				pool.active += 1
				resolve()
			})
		})
		return {
			...this.getPoolStats(id),
			waitTimeMs: Math.max(0, Date.now() - requestedAt),
		}
	}

	release(id: string) {
		const pool = this.ensurePool(id)
		pool.active = Math.max(0, pool.active - 1)
		const next = pool.waiting.shift()
		if (next) {
			next()
		}
	}

	getPoolStats(id: string): PoolStats {
		const state = this.ensurePool(id)
		return {
			id,
			activeWorkers: state.active,
			waitingWorkers: state.waiting.length,
			maxConcurrencyPerInstance: state.max,
		}
	}

	snapshot(): PoolStats[] {
		return Array.from(this.pools.keys()).map(id => this.getPoolStats(id))
	}

	private ensurePool(id: string) {
		const pool = this.pools.get(id)
		if (!pool) {
			const state: PoolState = { active: 0, max: 1, waiting: [] }
			this.pools.set(id, state)
			return state
		}
		return pool
	}
}
