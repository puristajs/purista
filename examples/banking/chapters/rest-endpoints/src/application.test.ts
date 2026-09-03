import { serve } from '@hono/node-server'
import { initLogger } from '@purista/core'
import { once } from 'node:events'
import { describe, expect, test } from 'vitest'
import { createApplication } from './application.js'
import { createNodeHttpListener } from './nodeHttpListener.js'

async function destroyApplication(app: Awaited<ReturnType<typeof createApplication>>) {
	await app.http.prepareDestroy().destroy()
	await app.http.destroy()
	await app.transaction.destroy()
	await app.bankProfile.destroy()
	await app.eventBridge.destroy()
}

describe('Hono application boundary', () => {
	test('serves the website without taking ownership of API paths', async () => {
		const app = await createApplication(initLogger('fatal'))
		try {
			const home = await app.http.app.request('/')
			expect(home.status).toBe(200)
			expect(home.headers.get('content-type')).toContain('text/html')
			const html = await home.text()
			expect(html).toContain('<div id="root"></div>')

			const assetPath = html.match(/src="(\/assets\/[^"]+\.js)"/)?.[1]
			expect(assetPath).toBeDefined()
			const asset = await app.http.app.request(assetPath ?? '')
			expect(asset.status).toBe(200)
			expect(asset.headers.get('content-type')).toContain('javascript')

			const browserPath = await app.http.app.request('/overview')
			expect(browserPath.status).toBe(200)
			expect(browserPath.headers.get('content-type')).toContain('text/html')

			const api = await app.http.app.request('/api/v1/profile')
			expect(api.status).toBe(200)
			expect(await api.json()).toEqual({ name: 'Example Bank', currency: 'EUR' })

			const missingApi = await app.http.app.request('/api/v1/missing')
			expect(missingApi.status).toBe(404)
			expect(missingApi.headers.get('content-type')).toContain('application/problem+json')
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
			const response = await fetch(`http://127.0.0.1:${address.port}/`)
			expect(response.status).toBe(200)
			expect(response.headers.get('content-type')).toContain('text/html')
		} finally {
			await app.http.prepareDestroy().destroy()
			await createNodeHttpListener(nodeServer).destroy()
			await app.http.destroy()
			await app.transaction.destroy()
			await app.bankProfile.destroy()
			await app.eventBridge.destroy()
		}

		expect(nodeServer.listening).toBe(false)
	})
})
