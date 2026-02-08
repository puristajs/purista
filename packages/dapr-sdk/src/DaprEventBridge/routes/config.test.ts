import { getLoggerMock, safeBind } from '@purista/core'
import { Hono } from 'hono'

import { configRoute } from './config.impl.js'

describe('config route', () => {
	it('returns the config object', async () => {
		const logger = getLoggerMock()

		const bridge = {
			logger: logger.mock,
		} as unknown as ThisParameterType<typeof configRoute>

		const app = new Hono()
		app.get('/dapr/config', c => safeBind(configRoute, bridge)(c))

		const response = await app.request('http://localhost/dapr/config')

		expect(response.status).toBe(200)
		await expect(response.json()).resolves.toStrictEqual({
			entities: [],
		})
		expect(logger.stubs.debug.calledOnceWith('config requested')).toBeTruthy()
	})
})
