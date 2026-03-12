import type { ProviderResponse, ProviderStream, ProviderStreamChunk } from './ModelProvider.js'

export const normalizeReasoningDelta = (chunk: unknown): string => {
	if (!chunk || typeof chunk !== 'object') {
		return ''
	}
	const withText = chunk as { text?: unknown }
	if (typeof withText.text === 'string') {
		return withText.text
	}
	const withDelta = chunk as { delta?: unknown }
	if (typeof withDelta.delta === 'string') {
		return withDelta.delta
	}
	return ''
}

export const collectStreamText = async (
	stream: ProviderStream,
	options?: {
		onReasoning?: (text: string) => void | Promise<void>
		onTextDelta?: (delta: string) => void | Promise<void>
	},
): Promise<ProviderResponse> => {
	let textOutput = ''
	for await (const chunk of stream) {
		if (chunk.type === 'error') {
			throw chunk.error
		}
		if (chunk.type === 'reasoning-delta') {
			if (chunk.reasoningDelta.trim()) {
				await options?.onReasoning?.(chunk.reasoningDelta)
			}
			continue
		}
		textOutput += chunk.textDelta
		await options?.onTextDelta?.(chunk.textDelta)
	}

	const final = await stream.final()
	if (final.reasoningText?.trim()) {
		await options?.onReasoning?.(final.reasoningText)
	}
	return {
		...final,
		output: final.output || textOutput,
	}
}

export const textDelta = (value: string): ProviderStreamChunk => ({
	type: 'text-delta',
	textDelta: value,
})

export const reasoningDelta = (value: string): ProviderStreamChunk => ({
	type: 'reasoning-delta',
	reasoningDelta: value,
})
