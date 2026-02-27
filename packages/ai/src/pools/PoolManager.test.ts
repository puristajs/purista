import { describe, expect, it } from 'vitest'

import { PoolManager } from './PoolManager.js'

describe('PoolManager', () => {
	it('limits concurrency and releases slots', async () => {
		const pools = new PoolManager({ default: 1 })

		const events: string[] = []

		await Promise.all([
			pools.acquire('default').then(async () => {
				events.push('first-acquired')
				await new Promise(resolve => setTimeout(resolve, 5))
				pools.release('default')
				events.push('first-released')
			}),
			pools.acquire('default').then(async () => {
				events.push('second-acquired')
				pools.release('default')
				events.push('second-released')
			}),
		])

		expect(events[0]).toBe('first-acquired')
		expect(events.includes('second-acquired')).toBe(true)
	})
})
