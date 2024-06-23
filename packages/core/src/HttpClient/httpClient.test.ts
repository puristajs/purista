import { createSandbox } from 'sinon'

import { getLoggerMock } from '../mocks/index.js'
import { HttpClient } from './HttpClient.impl.js'

describe('HttpClient', () => {
	const sandbox = createSandbox()

	afterEach(() => {
		sandbox.restore()
		sandbox.reset()
	})

	it('can post', async () => {
		const logger = getLoggerMock()
		const client = new HttpClient({
			baseUrl: 'http://example.com',
			logger: logger.mock,
			defaultHeaders: {
				'content-type': 'application/json; charset=utf-8',
			},
		})

		client.setBearerToken('123')

		const payload = { some: 'data' }
		const response = { ok: 'ok' }

		sandbox.stub(global, 'fetch').callsFake((url, req) => {
			expect(url).toStrictEqual(new URL('http://example.com/example'))
			expect(req?.method).toBe('POST')

			const x = req?.headers as any
			expect(x.Authorization).toBe('Bearer 123')
			expect(x['content-type']).toBe('application/json; charset=utf-8')

			return Promise.resolve({
				headers: {
					get: () => 'application/json',
				},
				ok: true,
				json: () => Promise.resolve(response),
				text: () => Promise.resolve(JSON.stringify(response)),
			} as any)
		})

		await expect(client.post('/example', payload)).resolves.toBe(response)
	})

	it('can patch', async () => {
		const logger = getLoggerMock()
		const client = new HttpClient({ baseUrl: 'http://example.com', logger: logger.mock })

		const payload = { some: 'data' }
		const response = { ok: 'ok' }

		sandbox.stub(global, 'fetch').callsFake((url, req) => {
			expect(url).toStrictEqual(new URL('http://example.com/example'))
			expect(req?.method).toBe('PATCH')
			expect(req?.body).toBe(JSON.stringify(payload))
			return Promise.resolve({
				headers: {
					get: () => 'application/json',
				},
				ok: true,
				json: () => Promise.resolve(response),
				text: () => Promise.resolve(JSON.stringify(response)),
			} as any)
		})

		await expect(client.patch('/example', payload)).resolves.toBe(response)
	})

	it('can put', async () => {
		const logger = getLoggerMock()
		const client = new HttpClient({ baseUrl: 'http://example.com', logger: logger.mock })

		const payload = { some: 'data' }
		const response = { ok: 'ok' }

		sandbox.stub(global, 'fetch').callsFake((url, req) => {
			expect(url).toStrictEqual(new URL('http://example.com/example'))
			expect(req?.method).toBe('PUT')
			expect(req?.body).toBe(JSON.stringify(payload))
			return Promise.resolve({
				headers: {
					get: () => 'application/json',
				},
				ok: true,
				json: () => Promise.resolve(response),
				text: () => Promise.resolve(JSON.stringify(response)),
			} as any)
		})

		await expect(client.put('/example', payload)).resolves.toBe(response)
	})

	it('can delete', async () => {
		const logger = getLoggerMock()
		const client = new HttpClient({ baseUrl: 'http://example.com', logger: logger.mock })

		const response = { ok: 'ok' }

		sandbox.stub(global, 'fetch').callsFake((url, req) => {
			expect(url).toStrictEqual(new URL('http://example.com/example'))
			expect(req?.method).toBe('DELETE')
			expect(req?.body).toBeUndefined()
			return Promise.resolve({
				headers: {
					get: () => 'application/json',
				},
				ok: true,
				json: () => Promise.resolve(response),
				text: () => Promise.resolve(JSON.stringify(response)),
			} as any)
		})

		await expect(client.delete('/example')).resolves.toBe(response)
	})

	it('can get', async () => {
		const logger = getLoggerMock()
		const client = new HttpClient({ baseUrl: 'http://example.com', logger: logger.mock })

		const response = { ok: 'ok' }

		sandbox.stub(global, 'fetch').callsFake((url, req) => {
			expect(url).toStrictEqual(new URL('http://example.com/example'))
			expect(req?.method).toBe('GET')
			expect(req?.body).toBeUndefined()
			return Promise.resolve({
				headers: {
					get: () => 'application/json',
				},
				ok: true,
				json: () => Promise.resolve(response),
				text: () => Promise.resolve(JSON.stringify(response)),
			} as any)
		})

		await expect(client.get('/example')).resolves.toBe(response)
	})

	it('can get json', async () => {
		const logger = getLoggerMock()
		const client = new HttpClient({ baseUrl: 'http://example.com', logger: logger.mock })

		const response = { ok: 'ok' }

		sandbox.stub(global, 'fetch').callsFake((url, req) => {
			expect(url).toStrictEqual(new URL('http://example.com/example'))
			expect(req?.method).toBe('GET')
			expect(req?.body).toBeUndefined()
			return Promise.resolve({
				headers: {
					get: () => 'application/json',
				},
				ok: true,
				json: () => Promise.resolve(response),
				text: () => Promise.resolve(JSON.stringify(response)),
			} as any)
		})

		await expect(client.get('/example')).resolves.toBe(response)
	})

	it('throws', async () => {
		const logger = getLoggerMock()
		const client = new HttpClient({ baseUrl: 'http://example.com', logger: logger.mock })

		const response = { ok: 'ok' }

		sandbox.stub(global, 'fetch').callsFake((url, req) => {
			expect(url).toStrictEqual(new URL('http://example.com/example'))
			expect(req?.method).toBe('GET')
			expect(req?.body).toBeUndefined()
			return Promise.resolve({
				status: 400,
				headers: {
					get: () => 'application/json',
				},
				ok: false,
				json: () => Promise.resolve(response),
				text: () => Promise.resolve(JSON.stringify(response)),
			} as any)
		})

		await expect(client.get('/example')).rejects.toThrow('Bad Request')
	})
})
