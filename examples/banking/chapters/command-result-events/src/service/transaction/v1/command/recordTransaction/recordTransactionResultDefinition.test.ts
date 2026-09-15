import { expect, test } from 'vitest'
import { recordTransactionCommandBuilder } from './recordTransactionCommandBuilder.js'

test('declares the successful transaction result as a named event', async () => {
	const definition = await recordTransactionCommandBuilder.getDefinition()

	expect(definition.eventName).toBe('transaction.recorded.v1')
	expect(definition.metadata.expose.outputPayload).toMatchObject({
		type: 'object',
		properties: {
			transactionId: { type: 'string' },
			accountId: { type: 'string' },
		},
	})
})
