type PoolState = {
	active: number
	max: number
	waiting: Array<() => void>
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
		const existing = this.pools.get(id)
		if (existing) {
			existing.max = maxParallel
			return
		}
		this.pools.set(id, { active: 0, max: maxParallel, waiting: [] })
	}

	async acquire(id: string) {
		const pool = this.ensurePool(id)
		if (pool.active < pool.max) {
			pool.active += 1
			return
		}
		await new Promise<void>(resolve => {
			pool.waiting.push(() => {
				pool.active += 1
				resolve()
			})
		})
	}

	release(id: string) {
		const pool = this.ensurePool(id)
		pool.active = Math.max(0, pool.active - 1)
		const next = pool.waiting.shift()
		if (next) {
			next()
		}
	}

	snapshot() {
		return Array.from(this.pools.entries()).map(([id, state]) => ({
			id,
			active: state.active,
			max: state.max,
			waiting: state.waiting.length,
		}))
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
