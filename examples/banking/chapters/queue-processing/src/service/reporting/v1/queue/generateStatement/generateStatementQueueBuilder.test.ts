import { expect, test } from 'vitest'
import { generateStatementQueueBuilder } from './generateStatementQueueBuilder.js'

test('declares the queue contract and bounded local retry policy', async () => {
	const definition = await generateStatementQueueBuilder.getDefinition()
	expect(definition.queueName).toBe('generateStatement')
	expect(definition.lifecycle).toMatchObject({ maxAttempts: 3 })
	expect(definition.resultPolicy).toMatchObject({
		mode: 'state', delivery: 'required', ttlMs: 15 * 60 * 1000,
	})
})
