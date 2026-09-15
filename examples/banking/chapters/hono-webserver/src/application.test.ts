import { serve } from '@hono/node-server'
import { initLogger } from '@purista/core'
import { once } from 'node:events'
import { describe, expect, test } from 'vitest'
import { createApplication } from './application.js'
import { createNodeHttpListener } from './nodeHttpListener.js'

async function destroyApplication(app: Awaited<ReturnType<typeof createApplication>>) {
	await app.http.prepareDestroy().destroy()
	await app.http.destroy()
	await app.bankProfile.destroy()
	await app.eventBridge.destroy()
}

describe('Hono application boundary', () => {
	test('projects the public command and OpenAPI contract', async () => {
		const app = await createApplication(initLogger('fatal'))
		try {
			const response = await app.http.app.request('/api/v1/profile')
			expect(response.status).toBe(200)
			expect(await response.json()).toEqual({ name: 'Example Bank', currency: 'EUR' })

			const openApi = await app.http.app.request('/api/openapi.json')
			expect(openApi.status).toBe(200)
			expect(Object.keys((await openApi.json()).paths)).toContain('/api/v1/profile')
		} finally {
			await destroyApplication(app)
		}
	})

	test('serves through Node and releases the listener', async () => {
		const app = await createApplication(initLogger('fatal'))
		const nodeServer = serve({ fetch: app.http.app.fetch, hostname: '127.0.0.1', port: 0 })
		await once(nodeServer, 'listening')
		const address = nodeServer.address()
		expect(address).not.toBeNull()
		expect(typeof address).not.toBe('string')
		if (!address || typeof address === 'string') throw new Error('Expected a TCP listener')

		try {
			const response = await fetch(`http://127.0.0.1:${address.port}/api/v1/profile`)
			expect(response.status).toBe(200)
		} finally {
			await app.http.prepareDestroy().destroy()
			await createNodeHttpListener(nodeServer).destroy()
			await app.http.destroy()
			await app.bankProfile.destroy()
			await app.eventBridge.destroy()
		}

		expect(nodeServer.listening).toBe(false)
	})
})
