export function chunkKnowledgeText(text: string, wordsPerChunk = 80) {
	if (!Number.isInteger(wordsPerChunk) || wordsPerChunk < 1) {
		throw new Error('wordsPerChunk must be a positive integer')
	}
	const words = text.trim().split(/\s+/u).filter(Boolean)
	const chunks: string[] = []
	for (let start = 0; start < words.length; start += wordsPerChunk) {
		chunks.push(words.slice(start, start + wordsPerChunk).join(' '))
	}
	return chunks
}
