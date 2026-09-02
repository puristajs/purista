import { expect, test } from 'vitest'
import { destroyInOrder } from './ProcessRuntime.js'

test('destroys owned resources sequentially in the declared order', async () => {
	const order: string[] = []
	await destroyInOrder([
		{ destroy: async () => { order.push('service') } },
		{ destroy: async () => { order.push('store') } },
		{ destroy: async () => { order.push('eventBridge') } },
	])
	expect(order).toEqual(['service', 'store', 'eventBridge'])
})
