import { DefaultEventBridge, initLogger } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { describe, expect, test } from 'vitest'
import { bankingV1Service } from '../../bankingV1Service.js'

describe('bank information', () => {
	test('serves the registered command through HTTP and the EventBridge', async () => {
		const logger = initLogger('error')
		const eventBridge = new DefaultEventBridge({ logger })
		await eventBridge.start()
		const service = await bankingV1Service.getInstance(eventBridge, { logger })
		const http = await honoV1Service.getInstance(eventBridge, { logger })
		try {
			await service.start()
			http.registerService(service)
			await http.start()
			const response = await http.app.request('/api/v1/bank')
			expect(response.status).toBe(200)
			expect(await response.json()).toEqual({ name: 'Example Bank', currency: 'EUR' })
		} finally {
			await http.destroy()
			await service.destroy()
			await eventBridge.destroy()
		}
	})
})
