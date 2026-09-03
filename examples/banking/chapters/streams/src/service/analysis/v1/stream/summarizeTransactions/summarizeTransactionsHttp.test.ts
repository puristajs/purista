import { isHttpExposedServiceMeta } from '@purista/core'
import { expect, test } from 'vitest'
import { summarizeTransactionsStreamBuilder } from './summarizeTransactionsStreamBuilder.js'

test('declares one protected SSE endpoint', async () => {
	const definition = await summarizeTransactionsStreamBuilder.getDefinition()
	expect(isHttpExposedServiceMeta(definition.metadata)).toBe(true)
	if (!isHttpExposedServiceMeta(definition.metadata)) throw new Error('Expected HTTP stream metadata')
	expect(definition.metadata.expose.contentTypeResponse).toBe('text/event-stream')
	expect(definition.metadata.expose.http).toMatchObject({
		method: 'GET',
		path: 'analysis/accounts/:accountId/transactions',
		openApi: { isSecure: true },
		stream: { mode: 'stream', protocol: 'purista-stream-v1' },
	})
})
