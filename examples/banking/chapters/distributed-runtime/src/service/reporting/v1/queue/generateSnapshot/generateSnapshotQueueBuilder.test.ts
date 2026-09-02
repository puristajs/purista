import { describe, expect, it } from 'vitest'
import { generateSnapshotQueueBuilder } from './generateSnapshotQueueBuilder.js'

describe('service Reporting version 1 - queue generateSnapshot', () =>{
	it('resolves queue definition', async () =>{
		const definition = await generateSnapshotQueueBuilder.getDefinition()
		expect(definition.queueName).toBe('generateSnapshot')
	})
})