import { expect, test } from 'vitest'
import { createTestBank } from '../../../../../testing/createTestBank.js'

test('serves the registered bank information command', async () => {
	const bank = await createTestBank()
	try {
		const response = await bank.request('/api/v1/bank')
		expect(response.status).toBe(200)
		expect(await response.json()).toEqual({ name: 'Example Bank', currency: 'EUR' })
	} finally {
		await bank.destroy()
	}
})
