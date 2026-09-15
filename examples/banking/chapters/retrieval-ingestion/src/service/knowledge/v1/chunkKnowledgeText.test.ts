import { describe, expect, it } from 'vitest'
import { chunkKnowledgeText } from './chunkKnowledgeText.js'

describe('chunkKnowledgeText', () => {
	it('normalizes whitespace and keeps deterministic chunk order', () => {
		expect(chunkKnowledgeText('  one   two three four  ', 2)).toEqual(['one two', 'three four'])
	})

	it('rejects an invalid chunk size', () => {
		expect(() => chunkKnowledgeText('text', 0)).toThrow('wordsPerChunk must be a positive integer')
	})
})
