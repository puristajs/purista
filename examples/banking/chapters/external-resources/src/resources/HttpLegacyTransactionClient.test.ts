import { initLogger, StatusCode } from '@purista/core'
import { once } from 'node:events'
import type { AddressInfo } from 'node:net'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { HttpLegacyTransactionClient } from './HttpLegacyTransactionClient.js'
import { createMockLegacyTransactionProvider } from './mockLegacyTransactionProvider.js'

let server: ReturnType<typeof createMockLegacyTransactionProvider>
let baseUrl: string

beforeEach(async () => {
	server = createMockLegacyTransactionProvider()
	server.listen(0, '127.0.0.1')
	await once(server, 'listening')
	baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
})

afterEach(async () => {
	server.closeAllConnections()
	await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
})

describe('HttpLegacyTransactionClient', () => {
	test('returns a validated provider record', async () => {
		const client = new HttpLegacyTransactionClient({ baseUrl, logger: initLogger('fatal'), timeoutMs: 100 })
		await expect(client.fetchTransaction('provider-1001', 'example-bank-tutorial-token'))
			.resolves.toBe('debit|25.99|Northwind Books|Provider 1001')
	})

	test('maps malformed and mismatched responses to a safe gateway error', async () => {
		const client = new HttpLegacyTransactionClient({ baseUrl, logger: initLogger('fatal'), timeoutMs: 100 })
		await expect(client.fetchTransaction('malformed', 'example-bank-tutorial-token'))
			.rejects.toMatchObject({ errorCode: StatusCode.BadGateway })
		await expect(client.fetchTransaction('mismatch', 'example-bank-tutorial-token'))
			.rejects.toMatchObject({ errorCode: StatusCode.BadGateway })
	})

	test('maps the bounded request timeout without exposing provider data', async () => {
		const client = new HttpLegacyTransactionClient({ baseUrl, logger: initLogger('fatal'), timeoutMs: 25 })
		await expect(client.fetchTransaction('slow', 'example-bank-tutorial-token'))
			.rejects.toMatchObject({
				errorCode: StatusCode.GatewayTimeout,
				message: 'The transaction provider timed out',
			})
	})
})
