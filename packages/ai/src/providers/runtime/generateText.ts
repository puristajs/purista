import { StatusCode, UnhandledError } from '@purista/core'
import type { ModelProvider, ProviderRequest } from './ModelProvider.js'
import { collectStreamText } from './streamNormalization.js'

export type GenerateTextOptions = {
	model: Pick<ModelProvider, 'generate' | 'stream' | 'generateText'>
	request: ProviderRequest
	onReasoning?: (text: string) => void | Promise<void>
	onTextDelta?: (delta: string) => void | Promise<void>
}

/**
 * Generates one final text output from a model provider.
 *
 * Strategy:
 * 1. Prefer `stream()` when available and forward reasoning/text callbacks.
 * 2. Fallback to `generate()` when streaming is not available.
 */
export const generateText = async (input: GenerateTextOptions): Promise<string> => {
	const { model, request, onReasoning, onTextDelta } = input

	if (typeof model.generateText === 'function') {
		return await model.generateText({
			...request,
			onReasoning,
			onTextDelta,
		})
	}

	if (typeof model.stream === 'function') {
		const final = await collectStreamText(model.stream(request), {
			onReasoning,
			onTextDelta,
		})
		return final.output
	}

	if (typeof model.generate === 'function') {
		const result = await model.generate(request)
		if (result.reasoningText?.trim()) {
			await onReasoning?.(result.reasoningText)
		}
		return result.output
	}

	throw new UnhandledError(StatusCode.InternalServerError, 'Model provider must support stream() or generate()')
}
