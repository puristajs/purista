import { describe, expect, it } from 'vitest'
import { ingestKnowledgeQueueBuilder } from './ingestKnowledgeQueueBuilder.js'

describe('service Knowledge version 1 - queue ingestKnowledge', () =>{
	it('resolves queue definition', async () =>{
		const definition = await ingestKnowledgeQueueBuilder.getDefinition()
		expect(definition.queueName).toBe('ingestKnowledge')
	})
})