import { describe, expect, it } from 'vitest'

import { pingJobQueueBuilder } from './pingJobQueueBuilder.js'

describe('service Ping version 1 - queue pingJob', () => {
	it('resolves queue definition', async () => {
		const definition = await pingJobQueueBuilder.getDefinition()
		expect(definition.queueName).toBe('pingJob')
	})
})
