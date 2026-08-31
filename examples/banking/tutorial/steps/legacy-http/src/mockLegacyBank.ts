import { createServer } from 'node:http'
import { pathToFileURL } from 'node:url'

/** A separate HTTP dependency with synthetic, tenant-scoped credentials and data. */
export function createLegacyBankMock() {
	const requests: { tenantId: string; principalId: string; accountId: string; sourceId: string }[] = []
	const server = createServer(async (request, response) => {
		const send = (status: number, body: unknown) => {
			response.writeHead(status, { 'content-type': 'application/json' })
			response.end(JSON.stringify(body))
		}
		const url = new URL(request.url ?? '/', 'http://mock.local')
		if (request.method !== 'GET') return send(405, { title: 'Use GET' })
		if (url.pathname === '/health') return send(200, { status: 'ok' })
		const tenantId =
			request.headers.authorization === 'Bearer mock-north'
				? 'tenant-north'
				: request.headers.authorization === 'Bearer mock-south'
					? 'tenant-south'
					: undefined
		if (!tenantId) return send(401, { title: 'Unknown mock credential' })
		const match = /^\/transactions\/([a-zA-Z0-9_-]+)$/.exec(url.pathname)
		if (!match) return send(404, { title: 'Unknown route' })
		const sourceId = match[1]
		const accountId = url.searchParams.get('accountId') ?? ''
		if (!['account-a', 'account-c'].includes(accountId)) return send(400, { title: 'Unknown fixture account' })
		if (tenantId === 'tenant-south' && accountId !== 'account-a') return send(403, { title: 'Account not assigned' })
		requests.push({ tenantId, principalId: String(request.headers['x-example-principal'] ?? ''), accountId, sourceId })
		if (sourceId === 'missing') return send(404, { title: 'No such transaction' })
		if (sourceId === 'slow') {
			await new Promise<void>(resolve => {
				const timer = setTimeout(resolve, 2000)
				response.once('close', () => {
					clearTimeout(timer)
					resolve()
				})
			})
			if (response.destroyed) return
		}
		if (sourceId === 'malformed') return send(200, { amount: 'not-a-transaction' })
		if (sourceId === 'oversized') return send(200, { padding: 'x'.repeat(20_000) })
		if (!['legacy-001', 'slow', 'wrong-account', 'wrong-id'].includes(sourceId))
			return send(404, { title: 'No such transaction' })
		send(200, {
			source_id: sourceId === 'wrong-id' ? 'different-id' : sourceId,
			account_ref: sourceId === 'wrong-account' ? 'account-c' : accountId,
			booked_at: '2026-01-15T12:00:00.000Z',
			amount: tenantId === 'tenant-north' ? '125.40' : '99.00',
			currency: 'EUR',
			dc: 'D',
		})
	})
	return { server, requests }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	const { server } = createLegacyBankMock()
	const hostname = process.env.MOCK_HOST ?? '127.0.0.1'
	const port = Number(process.env.MOCK_PORT ?? 4010)
	server.listen(port, hostname, () => process.stdout.write('Legacy bank mock is listening\n'))
	process.once('SIGTERM', () => server.close())
	process.once('SIGINT', () => server.close())
}
