import {
	demoEmbeddingDimensions,
	demoEmbeddingModel,
	type KnowledgeEmbeddingProvider,
} from '../service/knowledge/v1/KnowledgeResources.js'

function vectorFor(text: string) {
	const values = Array.from({ length: demoEmbeddingDimensions }, () => 0)
	for (const [index, character] of Array.from(text).entries()) {
		values[index % values.length] += character.codePointAt(0) ?? 0
	}
	const length = Math.hypot(...values) || 1
	return values.map((value) => value / length)
}

export const deterministicKnowledgeEmbeddingProvider: KnowledgeEmbeddingProvider = {
	model: demoEmbeddingModel,
	dimensions: demoEmbeddingDimensions,
	async embedQuery({ text, signal }) {
		signal?.throwIfAborted()
		return vectorFor(text)
	},
}
