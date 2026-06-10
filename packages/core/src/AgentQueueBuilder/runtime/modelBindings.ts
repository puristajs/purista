import {
	createModelRegistry,
	type JsonValue,
	type ModelAlias,
	type ModelCapability,
	type ModelInvokeContext,
	type RunEvent,
	type TokenUsage,
} from '@purista/harness'

import { getUniqueId } from '../../core/helper/getUniqueId.impl.js'
import type {
	AgentHandlerModelBindings,
	AgentManifest,
	AgentModelBinding,
	AgentRuntimeModelBindings,
	ResolvedAgentRuntimeModelBindings,
} from '../types.js'

export type HandlerModelRunEventContext = {
	runId: string
	agentId: string
	emit(event: RunEvent): Promise<void>
}

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
	runEventContext?: HandlerModelRunEventContext,
): AgentHandlerModelBindings<Models> {
	const registry = createModelRegistry(resolvedModels)
	if (!runEventContext) {
		return registry as unknown as AgentHandlerModelBindings<Models>
	}

	return Object.fromEntries(
		Object.entries(registry).map(([alias, handle]) => [alias, wrapModelHandle(alias, handle, runEventContext)]),
	) as unknown as AgentHandlerModelBindings<Models>
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

function wrapModelHandle(alias: string, handle: unknown, context: HandlerModelRunEventContext) {
	const source = handle as Record<string, unknown>
	const wrapped: Record<string, unknown> = { ...source }

	const textStream = source.textStream
	if (typeof textStream === 'function') {
		wrapped.textStream = (req: unknown, signal: AbortSignal, modelContext?: ModelInvokeContext) => {
			const stream = textStream.call(source, req, signal, modelContext) as AsyncIterable<unknown>
			if (modelContext?.emitRunEvents !== true) {
				return stream
			}
			return emitTextStreamRunEvents(stream, context, alias)
		}
	}

	const objectStream = source.objectStream
	if (typeof objectStream === 'function') {
		wrapped.objectStream = (req: unknown, signal: AbortSignal, modelContext?: ModelInvokeContext) => {
			const stream = objectStream.call(source, req, signal, modelContext) as AsyncIterable<unknown>
			if (modelContext?.emitRunEvents !== true) {
				return stream
			}
			return emitObjectStreamRunEvents(stream, context, alias)
		}
	}

	return wrapped
}

async function* emitTextStreamRunEvents(
	stream: AsyncIterable<unknown>,
	context: HandlerModelRunEventContext,
	modelAlias: string,
): AsyncIterable<unknown> {
	const streamId = createModelStreamId()
	for await (const chunk of stream) {
		if (isTextDeltaChunk(chunk)) {
			await context.emit({
				type: 'model.delta',
				runId: context.runId,
				agentId: context.agentId,
				modelAlias,
				streamId,
				delta: chunk.text,
			})
		}
		yield chunk
	}
}

async function* emitObjectStreamRunEvents(
	stream: AsyncIterable<unknown>,
	context: HandlerModelRunEventContext,
	modelAlias: string,
): AsyncIterable<unknown> {
	const streamId = createModelStreamId()
	for await (const chunk of stream) {
		if (isObjectPartialChunk(chunk)) {
			await context.emit({
				type: 'model.object.partial',
				runId: context.runId,
				agentId: context.agentId,
				modelAlias,
				streamId,
				partial: chunk.partial as JsonValue,
			})
		} else if (isObjectFinishChunk(chunk)) {
			await context.emit({
				type: 'model.object',
				runId: context.runId,
				agentId: context.agentId,
				modelAlias,
				streamId,
				object: chunk.object as JsonValue,
				...(chunk.usage ? { usage: chunk.usage } : {}),
			})
		}
		yield chunk
	}
}

function createModelStreamId() {
	return `model_${getUniqueId()}`
}

function isTextDeltaChunk(chunk: unknown): chunk is { kind: 'delta'; text: string } {
	return isRecord(chunk) && chunk.kind === 'delta' && typeof chunk.text === 'string'
}

function isObjectPartialChunk(chunk: unknown): chunk is { kind: 'partial'; partial: unknown } {
	return isRecord(chunk) && chunk.kind === 'partial' && 'partial' in chunk
}

function isObjectFinishChunk(chunk: unknown): chunk is { kind: 'finish'; object: unknown; usage?: TokenUsage } {
	return isRecord(chunk) && chunk.kind === 'finish' && 'object' in chunk
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null
}
