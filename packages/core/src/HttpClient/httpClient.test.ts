import { createSandbox } from 'sinon'

import { createMemoryMetricsRecorder } from '../core/metrics/index.js'
import { getLoggerMock } from '../mocks/index.js'
import { HttpClient } from './HttpClient.impl.js'

describe('HttpClient', () => {
	const sandbox = createSandbox()
	const createJsonResponse = (payload: unknown, init?: ResponseInit): Response => {
		return new Response(JSON.stringify(payload), {
			...init,
			headers: {
				'content-type': 'application/json',
				...(init?.headers ?? {}),
			},
		})
	}

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

			const headers = new Headers(req?.headers)
			expect(headers.get('authorization')).toBe('Bearer 123')
			expect(headers.get('content-type')).toBe('application/json; charset=utf-8')

			return Promise.resolve(createJsonResponse(response))
		})

		await expect(client.post('/example', payload)).resolves.toStrictEqual(response)
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
			return Promise.resolve(createJsonResponse(response))
		})

		await expect(client.patch('/example', payload)).resolves.toStrictEqual(response)
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
			return Promise.resolve(createJsonResponse(response))
		})

		await expect(client.put('/example', payload)).resolves.toStrictEqual(response)
	})

	it('can delete', async () => {
		const logger = getLoggerMock()
		const client = new HttpClient({ baseUrl: 'http://example.com', logger: logger.mock })

		const response = { ok: 'ok' }

		sandbox.stub(global, 'fetch').callsFake((url, req) => {
			expect(url).toStrictEqual(new URL('http://example.com/example'))
			expect(req?.method).toBe('DELETE')
			expect(req?.body).toBeUndefined()
			return Promise.resolve(createJsonResponse(response))
		})

		await expect(client.delete('/example')).resolves.toStrictEqual(response)
	})

	it('can get', async () => {
		const logger = getLoggerMock()
		const client = new HttpClient({ baseUrl: 'http://example.com', logger: logger.mock })

		const response = { ok: 'ok' }

		sandbox.stub(global, 'fetch').callsFake((url, req) => {
			expect(url).toStrictEqual(new URL('http://example.com/example'))
			expect(req?.method).toBe('GET')
			expect(req?.body).toBeUndefined()
			return Promise.resolve(createJsonResponse(response))
		})

		await expect(client.get('/example')).resolves.toStrictEqual(response)
	})

	it('can get json', async () => {
		const logger = getLoggerMock()
		const client = new HttpClient({ baseUrl: 'http://example.com', logger: logger.mock })

		const response = { ok: 'ok' }

		sandbox.stub(global, 'fetch').callsFake((url, req) => {
			expect(url).toStrictEqual(new URL('http://example.com/example'))
			expect(req?.method).toBe('GET')
			expect(req?.body).toBeUndefined()
			return Promise.resolve(createJsonResponse(response))
		})

		await expect(client.get('/example')).resolves.toStrictEqual(response)
	})

	it('records HTTP client request duration without raw URL attributes', async () => {
		const logger = getLoggerMock()
		const metricsRecorder = createMemoryMetricsRecorder()
		const client = new HttpClient({ baseUrl: 'http://example.com:8080', logger: logger.mock, metricsRecorder })

		sandbox.stub(global, 'fetch').resolves(createJsonResponse({ ok: true }, { status: 201 }))

		await expect(client.post('/example?secret=yes', { some: 'data' })).resolves.toStrictEqual({ ok: true })

		expect(metricsRecorder.records).toEqual([
			expect.objectContaining({
				name: 'http.client.request.duration',
				attributes: expect.objectContaining({
					'http.request.method': 'POST',
					'server.address': 'example.com',
					'server.port': 8080,
					'http.response.status_code': 201,
					'purista.outcome': 'success',
				}),
			}),
		])
		expect(Object.keys(metricsRecorder.records[0].attributes)).not.toContain('url.full')
	})

	it('throws', async () => {
		const logger = getLoggerMock()
		const client = new HttpClient({ baseUrl: 'http://example.com', logger: logger.mock })

		const response = { ok: 'ok' }

		sandbox.stub(global, 'fetch').callsFake((url, req) => {
			expect(url).toStrictEqual(new URL('http://example.com/example'))
			expect(req?.method).toBe('GET')
			expect(req?.body).toBeUndefined()
			return Promise.resolve(createJsonResponse(response, { status: 400, statusText: 'Bad Request' }))
		})

		await expect(client.get('/example')).rejects.toThrow('Bad Request')
	})
})
