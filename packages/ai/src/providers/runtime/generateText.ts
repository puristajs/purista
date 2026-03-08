import { StatusCode, UnhandledError } from '@purista/core'
import type { ModelProvider, ProviderRequest } from './ModelProvider.js'

export type GenerateTextOptions = {
	model: Pick<ModelProvider, 'generate' | 'stream'>
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

	if (typeof model.stream === 'function') {
		const stream = model.stream(request)
		let answer = ''
		for await (const chunk of stream) {
			if (chunk.type === 'error') {
				throw chunk.error
			}
			if (chunk.type === 'reasoning-delta') {
				if (chunk.reasoningDelta.trim()) {
					await onReasoning?.(chunk.reasoningDelta)
				}
				continue
			}
			answer += chunk.textDelta
			await onTextDelta?.(chunk.textDelta)
		}

		const final = await stream.final()
		if (final.reasoningText?.trim()) {
			await onReasoning?.(final.reasoningText)
		}
		return final.output || answer
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
