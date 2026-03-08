import { describe, expect, it } from 'vitest'

import { PoolManager } from './PoolManager.js'

describe('PoolManager', () => {
	it('limits concurrency and releases slots', async () => {
		const pools = new PoolManager({ default: 1 })

		const events: string[] = []
		const waitTimes: number[] = []

		await Promise.all([
			pools.acquire('default').then(async acquired => {
				events.push('first-acquired')
				waitTimes.push(acquired.waitTimeMs)
				await new Promise(resolve => setTimeout(resolve, 5))
				pools.release('default')
				events.push('first-released')
			}),
			pools.acquire('default').then(async acquired => {
				events.push('second-acquired')
				waitTimes.push(acquired.waitTimeMs)
				pools.release('default')
				events.push('second-released')
			}),
		])

		expect(events[0]).toBe('first-acquired')
		expect(events.includes('second-acquired')).toBe(true)
		expect(waitTimes.some(wait => wait > 0)).toBe(true)
		expect(pools.getPoolStats('default')).toEqual({
			id: 'default',
			activeWorkers: 0,
			waitingWorkers: 0,
			maxConcurrencyPerInstance: 1,
		})
	})
})
