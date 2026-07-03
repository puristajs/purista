import {
	type EmbeddingRequest,
	type EmbeddingResponse,
	type JsonValue,
	type ModelAlias,
	type ModelCallOptions,
	type ModelCapability,
	ModelCapabilityError,
	ModelError,
	type ObjectRequest,
	type RerankRequest,
	type RerankResponse,
	type TextRequest,
} from '@purista/harness'

import type {
	AgentHandlerModelBindings,
	AgentManifest,
	AgentModelBinding,
	AgentRuntimeModelBindings,
	ResolvedAgentRuntimeModelBindings,
} from '../types.js'

export function resolveRuntimeModelBindings<Models extends Record<string, AgentModelBinding>>(
	manifest: AgentManifest<Models>,
	runtimeModels: AgentRuntimeModelBindings<Models>,
): ResolvedAgentRuntimeModelBindings<Models> {
	const resolved: Partial<Record<keyof Models, ModelAlias>> = {}

	for (const [alias, declared] of Object.entries(manifest.models) as Array<
		[keyof Models & string, Models[keyof Models]]
	>) {
		const runtime = runtimeModels[alias]
		if (!runtime) {
			throw new Error(`Missing runtime model binding for agent model alias "${alias}"`)
		}

		const model = runtime.model ?? declared.model
		const detectedCapabilities = runtime.provider.info?.models?.[model]?.capabilities
		const capabilities = runtime.capabilities ?? detectedCapabilities ?? declared.capabilities
		assertCapabilities(alias, declared.capabilities, capabilities)

		resolved[alias] = {
			provider: runtime.provider,
			model,
			capabilities,
			defaults: {
				...declared.defaults,
				...runtime.defaults,
			},
			providerOptions: runtime.providerOptions,
		}
	}

	return resolved as ResolvedAgentRuntimeModelBindings<Models>
}

export function createHandlerModelBindings<Models extends Record<string, AgentModelBinding>>(
	resolvedModels: ResolvedAgentRuntimeModelBindings<Models>,
): AgentHandlerModelBindings<Models> {
	return Object.fromEntries(
		Object.entries(resolvedModels).map(([aliasKey, alias]) => [aliasKey, createModelHandle(aliasKey, alias)]),
	) as unknown as AgentHandlerModelBindings<Models>
}

function createModelHandle(aliasKey: string, alias: ModelAlias) {
	return {
		text(req: Omit<TextRequest, 'model' | 'signal' | 'defaults'>, signal: AbortSignal) {
			ensureProviderCapability(aliasKey, alias, 'text', req)
			if (!alias.provider.text) {
				throw methodMissing(aliasKey, 'text')
			}
			return alias.provider.text({
				model: alias.model,
				messages: req.messages,
				...(req.call ? { call: mergeCallOptions(alias, req.call) } : {}),
				...(mergeDefaults(alias, req.call) ? { defaults: mergeDefaults(alias, req.call) } : {}),
				...(req.tools ? { tools: req.tools } : {}),
				signal,
				traceparent: req.traceparent,
			})
		},
		textStream(req: Omit<TextRequest, 'model' | 'signal' | 'defaults'>, signal: AbortSignal) {
			ensureProviderCapability(aliasKey, alias, 'text_stream', req)
			if (!alias.provider.textStream) {
				throw methodMissing(aliasKey, 'textStream')
			}
			return alias.provider.textStream({
				model: alias.model,
				messages: req.messages,
				...(req.call ? { call: mergeCallOptions(alias, req.call) } : {}),
				...(mergeDefaults(alias, req.call) ? { defaults: mergeDefaults(alias, req.call) } : {}),
				...(req.tools ? { tools: req.tools } : {}),
				signal,
				traceparent: req.traceparent,
			})
		},
		object<T extends JsonValue>(req: Omit<ObjectRequest<T>, 'model' | 'signal' | 'defaults'>, signal: AbortSignal) {
			ensureProviderCapability(aliasKey, alias, 'object', req)
			if (!alias.provider.object) {
				throw methodMissing(aliasKey, 'object')
			}
			return alias.provider.object({
				model: alias.model,
				messages: req.messages,
				...(req.call ? { call: mergeCallOptions(alias, req.call) } : {}),
				...(mergeDefaults(alias, req.call) ? { defaults: mergeDefaults(alias, req.call) } : {}),
				...(req.tools ? { tools: req.tools } : {}),
				schema: req.schema,
				...(req.schemaName ? { schemaName: req.schemaName } : {}),
				signal,
				traceparent: req.traceparent,
			})
		},
		objectStream<T extends JsonValue>(
			req: Omit<ObjectRequest<T>, 'model' | 'signal' | 'defaults'>,
			signal: AbortSignal,
		) {
			ensureProviderCapability(aliasKey, alias, 'object_stream', req)
			if (!alias.provider.objectStream) {
				throw methodMissing(aliasKey, 'objectStream')
			}
			return alias.provider.objectStream({
				model: alias.model,
				messages: req.messages,
				...(req.call ? { call: mergeCallOptions(alias, req.call) } : {}),
				...(mergeDefaults(alias, req.call) ? { defaults: mergeDefaults(alias, req.call) } : {}),
				...(req.tools ? { tools: req.tools } : {}),
				schema: req.schema,
				...(req.schemaName ? { schemaName: req.schemaName } : {}),
				signal,
				traceparent: req.traceparent,
			})
		},
		async embed(req: Omit<EmbeddingRequest, 'model' | 'signal'>, signal: AbortSignal) {
			ensureProviderCapability(aliasKey, alias, 'embeddings', {})
			if (!alias.provider.embed) {
				throw methodMissing(aliasKey, 'embed')
			}
			return validateEmbeddingResponse(
				aliasKey,
				alias,
				{ model: alias.model, input: req.input, dimensions: req.dimensions, signal, traceparent: req.traceparent },
				await alias.provider.embed({
					model: alias.model,
					input: req.input,
					...(req.dimensions !== undefined ? { dimensions: req.dimensions } : {}),
					...(mergeCallOptions(alias, req.call) ? { call: mergeCallOptions(alias, req.call) } : {}),
					signal,
					traceparent: req.traceparent,
				}),
			)
		},
		async rerank(req: Omit<RerankRequest, 'model' | 'signal'>, signal: AbortSignal) {
			ensureProviderCapability(aliasKey, alias, 'rerank', {})
			if (!alias.provider.rerank) {
				throw methodMissing(aliasKey, 'rerank')
			}
			return validateRerankResponse(
				aliasKey,
				alias,
				{
					model: alias.model,
					query: req.query,
					documents: req.documents,
					topN: req.topN,
					signal,
					traceparent: req.traceparent,
				},
				await alias.provider.rerank({
					model: alias.model,
					query: req.query,
					documents: req.documents,
					...(req.topN !== undefined ? { topN: req.topN } : {}),
					...(mergeCallOptions(alias, req.call) ? { call: mergeCallOptions(alias, req.call) } : {}),
					signal,
					traceparent: req.traceparent,
				}),
			)
		},
	}
}

type CapabilityRequest =
	| Pick<TextRequest, 'messages' | 'tools'>
	| Pick<ObjectRequest, 'messages' | 'tools'>
	| EmptyObject

type EmptyObject = Record<string, never>

function ensureProviderCapability(
	aliasKey: string,
	alias: ModelAlias,
	method: ModelCapability,
	req: CapabilityRequest,
) {
	if (!alias.capabilities.includes(method)) {
		throw new ModelCapabilityError('Model alias does not provide requested capability.', {
			alias: aliasKey,
			method,
			reason: 'missing_capability',
		})
	}

	if ('tools' in req && req.tools && req.tools.length > 0 && !alias.capabilities.includes('tool_use')) {
		throw new ModelCapabilityError('Model alias does not support tool use.', {
			alias: aliasKey,
			method,
			reason: 'missing_capability',
		})
	}

	const parts =
		'messages' in req ? req.messages.flatMap(message => (Array.isArray(message.content) ? message.content : [])) : []

	if (
		parts.some(part => part.kind === 'image' || part.kind === 'image_url') &&
		!alias.capabilities.includes('vision_input')
	) {
		throw new ModelCapabilityError('Model alias does not support vision input.', {
			alias: aliasKey,
			method,
			reason: 'missing_capability',
		})
	}

	if (parts.some(part => part.kind === 'audio') && !alias.capabilities.includes('audio_input')) {
		throw new ModelCapabilityError('Model alias does not support audio input.', {
			alias: aliasKey,
			method,
			reason: 'missing_capability',
		})
	}

	if (
		parts.some(part => part.kind === 'file' || part.kind === 'file_url') &&
		!alias.capabilities.includes('file_input')
	) {
		throw new ModelCapabilityError('Model alias does not support file input.', {
			alias: aliasKey,
			method,
			reason: 'missing_capability',
		})
	}
}

function methodMissing(alias: string, method: string) {
	return new ModelCapabilityError('Model provider method is not implemented.', {
		alias,
		method,
		reason: 'method_missing',
	})
}

function mergeDefaults(alias: ModelAlias, call?: ModelCallOptions): ModelAlias['defaults'] | undefined {
	const retry = call?.retry ?? alias.defaults?.retry ?? alias.retry
	const providerOptions = {
		...(alias.providerOptions ?? {}),
		...(alias.defaults?.providerOptions ?? {}),
		...(call?.providerOptions ?? {}),
	}
	const merged: NonNullable<ModelAlias['defaults']> = {
		...(alias.defaults ?? {}),
		...(call ?? {}),
		...(retry !== undefined ? { retry } : {}),
		...(Object.keys(providerOptions).length > 0 ? { providerOptions } : {}),
	}
	return hasModelOptions(merged) ? merged : undefined
}

function mergeCallOptions(alias: ModelAlias, call?: ModelCallOptions): ModelCallOptions | undefined {
	const retry = call?.retry ?? alias.defaults?.retry ?? alias.retry
	const providerOptions = {
		...(alias.providerOptions ?? {}),
		...(alias.defaults?.providerOptions ?? {}),
		...(call?.providerOptions ?? {}),
	}
	const merged: ModelCallOptions = {
		...(call ?? {}),
		...(retry !== undefined ? { retry } : {}),
		...(Object.keys(providerOptions).length > 0 ? { providerOptions } : {}),
	}
	return hasModelOptions(merged) ? merged : undefined
}

function hasModelOptions(options: ModelCallOptions) {
	return (
		options.temperature !== undefined ||
		options.maxTokens !== undefined ||
		options.topP !== undefined ||
		options.stopSequences !== undefined ||
		options.parallelToolCalls !== undefined ||
		options.retry !== undefined ||
		Object.keys(options.providerOptions ?? {}).length > 0
	)
}

function validateEmbeddingResponse(
	aliasKey: string,
	alias: ModelAlias,
	req: EmbeddingRequest,
	response: EmbeddingResponse,
) {
	const expected = Array.isArray(req.input) ? req.input.length : 1
	const indices = new Set(response.embeddings.map(item => item.index))
	const validIndices = response.embeddings.every(
		item => Number.isInteger(item.index) && item.index >= 0 && item.index < expected,
	)
	if (response.embeddings.length !== expected || indices.size !== expected || !validIndices) {
		throw new ModelError('Embedding response does not match the request input count.', {
			provider: alias.provider.id,
			model: alias.model,
			method: 'embed',
			reason: 'embedding_count_mismatch',
			providerBody: { expected, received: response.embeddings.length, alias: aliasKey },
		})
	}
	return response
}

function validateRerankResponse(aliasKey: string, alias: ModelAlias, req: RerankRequest, response: RerankResponse) {
	const documentCount = req.documents.length
	const limit = req.topN !== undefined ? Math.min(req.topN, documentCount) : documentCount
	const indices = new Set(response.results.map(item => item.index))
	const validIndices = response.results.every(
		item => Number.isInteger(item.index) && item.index >= 0 && item.index < documentCount,
	)
	if (response.results.length > limit || indices.size !== response.results.length || !validIndices) {
		throw new ModelError('Rerank response does not map back to the request documents.', {
			provider: alias.provider.id,
			model: alias.model,
			method: 'rerank',
			reason: 'rerank_result_mismatch',
			providerBody: { documentCount, limit, received: response.results.length, alias: aliasKey },
		})
	}
	return response
}

function assertCapabilities(
	alias: string,
	required: readonly ModelCapability[],
	available: readonly ModelCapability[],
) {
	const missing = required.filter(capability => !available.includes(capability))
	if (missing.length > 0) {
		throw new Error(`Model alias "${alias}" is missing required capabilities: ${missing.join(', ')}`)
	}
}
