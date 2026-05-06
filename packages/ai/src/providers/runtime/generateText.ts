import { StatusCode, UnhandledError } from '@purista/core'
import type { ModelProvider, ProviderRequest } from './ModelProvider.js'
import type { ModelInvocationPolicy } from './modelInvocation.js'
import { runBoundedModelInvocation } from './modelInvocation.js'
import { collectStreamText } from './streamNormalization.js'

export type GenerateTextOptions = {
	model: Pick<ModelProvider, 'streamText' | 'generateText'>
	request: ProviderRequest
	onReasoning?: (text: string) => void | Promise<void>
	onTextDelta?: (delta: string) => void | Promise<void>
	policy?: ModelInvocationPolicy
	label?: string
}

/**
 * Generates one final text output from a model provider with optional bounded invocation policy.
 *
 * Strategy:
 * 1. Prefer `stream()` when available and forward reasoning/text callbacks.
 * 2. Fallback to `generate()` when streaming is not available.
 */
export const generateText = async (input: GenerateTextOptions): Promise<string> => {
	const { model, request, onReasoning, onTextDelta } = input
	return await runBoundedModelInvocation({
		label: input.label ?? 'model.generateText',
		policy: input.policy,
		operation: async () => {
			if (typeof model.generateText === 'function') {
				return await model.generateText({
					...request,
					onReasoning,
					onTextDelta,
				})
			}

			if (typeof model.streamText === 'function') {
				const final = await collectStreamText(model.streamText(request), {
					onReasoning,
					onTextDelta,
				})
				return final.output
			}

			throw new UnhandledError(
				StatusCode.InternalServerError,
				'Model provider must support streamText() or generateText()',
			)
		},
	})
}
