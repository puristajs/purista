import {
	demoEmbeddingDimensions,
	demoEmbeddingModel,
	type KnowledgeEmbeddingProvider,
} from './KnowledgeResources.js'

function vectorFor(text: string) {
	const values = Array.from({ length: demoEmbeddingDimensions }, () => 0)
	for (const [index, character] of Array.from(text).entries()) {
		values[index % values.length] += character.codePointAt(0) ?? 0
	}
	const length = Math.hypot(...values) || 1
	return values.map(value => value / length)
}

export const deterministicKnowledgeEmbeddingProvider: KnowledgeEmbeddingProvider = {
	async embed({ texts, model, signal }) {
		if (model !== demoEmbeddingModel) throw new Error('Unsupported embedding model')
		return texts.map(text => {
			signal.throwIfAborted()
			return vectorFor(text)
		})
	},
}
