import { describe, expect, it } from 'vitest'

import { pingJobWorkerQueueWorkerBuilder } from './pingJobWorkerQueueWorkerBuilder.js'

describe('service Ping version 1 - queue worker pingJobWorker', () => {
	it('resolves worker definition', async () => {
		const definition = await pingJobWorkerQueueWorkerBuilder.getDefinition()
		expect(definition.queueName).toBe('pingJob')
		expect(definition.name).toBe('pingJobWorker')
	})
})
