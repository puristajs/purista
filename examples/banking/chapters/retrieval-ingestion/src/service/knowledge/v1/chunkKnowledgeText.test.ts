import { expect, test } from 'vitest'
import { chunkKnowledgeText } from './chunkKnowledgeText.js'

test('normalizes whitespace and keeps stable chunk order', () => {
	expect(chunkKnowledgeText('  one   two three four five  ', 2)).toEqual([
		'one two',
		'three four',
		'five',
	])
})
