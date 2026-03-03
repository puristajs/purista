import type { Tracer } from '@opentelemetry/api'
import type { LanguageModel } from 'ai'
import { generateText } from 'ai'

import type { ModelProvider, ProviderRequest, ProviderResponse } from './ModelProvider.js'

/**
 * Options accepted by {@link AiSdkProvider}.
 */
export type AiSdkProviderOptions = {
	/**
	 * Language model instance (or provider id) created via the Vercel AI SDK (e.g. `openai('gpt-4o-mini')`).
	 */
	model: LanguageModel
	/**
	 * Optional readable name that shows up in telemetry. Defaults to the model identifier.
	 */
	name?: string
	/**
	 * Static system prompt prepended to every request.
	 */
	systemPrompt?: string
	/**
	 * Default call options forwarded to `generateText` (temperature, maxOutputTokens, tools, ...).
	 */
	defaults?: AiSdkProviderOverrides
	/**
	 * Optional tracer injected by the runtime. When set, AI SDK telemetry uses this tracer.
	 */
	tracer?: Tracer
}

/**
 * Request metadata field understood by {@link AiSdkProvider}. Attach it to {@link ProviderRequest.metadata}
 * to override call settings per invocation.
 *
 * @example
 * ```ts
 * await provider.generate({
 *   prompt: 'Summarise the ticket',
 *   metadata: {
 *     aiSdk: {
 *       temperature: 0.2,
 *       maxOutputTokens: 512,
 *     },
 *   },
 * })
 * ```
 */
export type AiSdkProviderMetadata = {
	aiSdk?: AiSdkProviderOverrides
}

/**
 * Supported overrides extracted from the AI SDK `generateText` call signature.
 */
type GenerateTextArgs = Parameters<typeof generateText>[0]
export type AiSdkProviderOverrides = Partial<Omit<GenerateTextArgs, 'model' | 'prompt' | 'system' | 'messages'>>

const isMetadata = (value: Record<string, unknown> | undefined): value is AiSdkProviderMetadata => {
	return !!value && typeof value === 'object' && 'aiSdk' in value
}

const composeSystemPrompt = (systemPrompt?: string, context?: string) => {
	const parts = [systemPrompt, context].filter(part => typeof part === 'string' && part.trim().length)
	if (!parts.length) {
		return undefined
	}
	return parts.join('\n\n')
}

/**
 * Wraps any Vercel AI SDK {@link LanguageModel} and exposes it through the lightweight {@link ModelProvider} interface
 * consumed by the PURISTA agent runtime.
 *
 * @example
 * ```ts
 * import { openai } from '@ai-sdk/openai'
 * import { AiSdkProvider } from '@purista/ai'
 *
 * const provider = new AiSdkProvider({
 *   model: openai('gpt-4o-mini'),
 *   systemPrompt: 'You are a helpful support engineer',
 * })
 *
 * const result = await provider.generate({ prompt: 'Reset password instructions?' })
 * console.log(result.output)
 * ```
 */
export class AiSdkProvider implements ModelProvider {
	readonly name: string

	private readonly model: LanguageModel
	private readonly systemPrompt?: string
	private readonly defaults: AiSdkProviderOverrides
	private readonly tracer?: Tracer

	constructor(options: AiSdkProviderOptions) {
		this.model = options.model
		this.systemPrompt = options.systemPrompt
		this.defaults = options.defaults ?? {}
		this.tracer = options.tracer
		this.name = options.name ?? (typeof options.model === 'string' ? options.model : 'ai-sdk-provider')
	}

	async generate(request: ProviderRequest): Promise<ProviderResponse> {
		const metadataOverrides = isMetadata(request.metadata) ? (request.metadata.aiSdk ?? {}) : {}
		const callInput: GenerateTextArgs = {
			...this.defaults,
			...metadataOverrides,
			model: this.model,
			prompt: request.prompt,
			system: composeSystemPrompt(this.systemPrompt, request.context),
			experimental_telemetry: {
				isEnabled: true,
				...(this.tracer ? { tracer: this.tracer } : {}),
				...(this.defaults.experimental_telemetry ?? {}),
				...(metadataOverrides.experimental_telemetry ?? {}),
			},
		}

		const result = await generateText(callInput)
		const { usage } = result

		return {
			output: result.text,
			tokens: {
				prompt: usage?.inputTokens ?? 0,
				completion: usage?.outputTokens ?? 0,
			},
			metadata: {
				request: result.request,
				response: result.response,
				providerMetadata: result.providerMetadata,
			},
		}
	}
}
