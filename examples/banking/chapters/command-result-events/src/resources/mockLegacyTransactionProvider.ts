import { createServer } from 'node:http'
import { pathToFileURL } from 'node:url'

const fixtureToken = 'example-bank-tutorial-token'

export function createMockLegacyTransactionProvider() {
	return createServer(async (request, response) => {
		const send = (status: number, body: unknown) => {
			response.writeHead(status, { 'content-type': 'application/json' })
			response.end(JSON.stringify(body))
		}
		const url = new URL(request.url ?? '/', 'http://provider.local')
		if (request.method !== 'GET') return send(405, { error: 'Use GET' })
		if (url.pathname === '/health') return send(200, { status: 'ok' })
		if (request.headers.authorization !== `Bearer ${fixtureToken}`) {
			return send(401, { error: 'Unknown fixture token' })
		}

		const match = /^\/transactions\/([a-zA-Z0-9_-]+)$/.exec(url.pathname)
		if (!match) return send(404, { error: 'Unknown route' })
		const sourceId = match[1]
		if (sourceId === 'missing') return send(404, { error: 'No such fixture' })
		if (sourceId === 'slow') {
			await new Promise<void>(resolve => {
				const timer = setTimeout(resolve, 500)
				response.once('close', () => {
					clearTimeout(timer)
					resolve()
				})
			})
			if (response.destroyed) return
		}
		if (sourceId === 'malformed') return send(200, { sourceId, record: { amount: '25.99' } })
		if (sourceId === 'mismatch') {
			return send(200, { sourceId: 'another-record', record: 'debit|25.99|Northwind Books' })
		}
		if (sourceId !== 'provider-1001' && sourceId !== 'slow') {
			return send(404, { error: 'No such fixture' })
		}
		return send(200, {
			sourceId,
			record: 'debit|25.99|Northwind Books|Provider 1001',
		})
	})
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	const server = createMockLegacyTransactionProvider()
	const host = process.env.MOCK_HOST ?? '127.0.0.1'
	const port = Number(process.env.MOCK_PORT ?? 4010)
	server.listen(port, host, () => process.stdout.write('Mock legacy transaction provider is ready\n'))
	process.once('SIGTERM', () => server.close())
	process.once('SIGINT', () => server.close())
}
