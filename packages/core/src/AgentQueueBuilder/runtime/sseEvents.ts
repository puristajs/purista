import type { RunEvent } from '@purista/harness'
import { z } from 'zod'

import type { AgentModelChunkVisibility, AgentRunEvent } from '../types.js'

/**
 * Provider-neutral multimodal content part schema used by AI outputs and
 * OpenAPI descriptions.
 *
 * @example
 * ```ts
 * const image = agentContentPartSchema.parse({
 *   kind: 'image_url',
 *   url: 'https://example.com/image.png',
 * })
 * ```
 */
export const agentContentPartSchema = z.discriminatedUnion('kind', [
	z.object({
		kind: z.literal('text'),
		text: z.string(),
	}),
	z.object({
		kind: z.literal('image'),
		mimeType: z.string(),
		dataBase64: z.string(),
	}),
	z.object({
		kind: z.literal('image_url'),
		url: z.string(),
		mimeType: z.string().optional(),
	}),
	z.object({
		kind: z.literal('audio'),
		mimeType: z.string(),
		dataBase64: z.string(),
	}),
	z.object({
		kind: z.literal('file'),
		mimeType: z.string(),
		dataBase64: z.string(),
		filename: z.string().optional(),
	}),
	z.object({
		kind: z.literal('file_url'),
		url: z.string(),
		mimeType: z.string().optional(),
		filename: z.string().optional(),
	}),
])

const tokenUsageSchema = z.object({
	inputTokens: z.number(),
	outputTokens: z.number(),
	totalTokens: z.number(),
})

const serializedErrorSchema = z.object({
	code: z.string(),
	category: z.string(),
	retriable: z.boolean(),
	message: z.string(),
	meta: z.record(z.string(), z.unknown()).optional(),
})

const responseEnvelopeSchema = z.object({
	id: z.string(),
	object: z.literal('response'),
	status: z.enum(['queued', 'in_progress', 'completed', 'failed', 'cancelled', 'incomplete']),
	created_at: z.number().int(),
	output: z.unknown().optional(),
	error: serializedErrorSchema.nullable().optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
})

const baseProviderEventDataSchema = z.object({
	type: z.string(),
	sequence_number: z.number().int(),
	response_id: z.string(),
	run_id: z.string(),
	agent_id: z.string().optional(),
	workflow_id: z.string().optional(),
	model_alias: z.string().optional(),
	stream_id: z.string().optional(),
})

/**
 * OpenAI Responses-style streaming event data for PURISTA agent streams.
 *
 * The event envelope uses normal SSE `event`/`data` framing. The JSON payload
 * keeps the provider-familiar `type` and `sequence_number` fields so clients
 * can consume it like modern OpenAI/Anthropic semantic streaming events.
 */
export const agentProviderEventDataSchema = z.discriminatedUnion('type', [
	baseProviderEventDataSchema.extend({
		type: z.literal('response.created'),
		response: responseEnvelopeSchema,
	}),
	baseProviderEventDataSchema.extend({
		type: z.literal('response.in_progress'),
		response: responseEnvelopeSchema,
	}),
	baseProviderEventDataSchema.extend({
		type: z.literal('response.output_text.delta'),
		output_index: z.number().int(),
		content_index: z.number().int(),
		delta: z.string(),
	}),
	baseProviderEventDataSchema.extend({
		type: z.literal('response.output_json.delta'),
		output_index: z.number().int(),
		content_index: z.number().int(),
		delta: z.unknown(),
	}),
	baseProviderEventDataSchema.extend({
		type: z.literal('response.output_json.done'),
		output_index: z.number().int(),
		content_index: z.number().int(),
		object: z.unknown(),
	}),
	baseProviderEventDataSchema.extend({
		type: z.literal('response.tool_call.started'),
		item_id: z.string(),
		tool_name: z.string(),
		input: z.unknown().optional(),
	}),
	baseProviderEventDataSchema.extend({
		type: z.literal('response.tool_call.completed'),
		item_id: z.string(),
		tool_name: z.string(),
		output: z.unknown().optional(),
		error: serializedErrorSchema.optional(),
	}),
	baseProviderEventDataSchema.extend({
		type: z.literal('response.model_embedding.completed'),
		count: z.number().int(),
		dimensions: z.number().int().optional(),
		usage: tokenUsageSchema.optional(),
	}),
	baseProviderEventDataSchema.extend({
		type: z.literal('response.model_rerank.completed'),
		count: z.number().int(),
		top_n: z.number().int().optional(),
		usage: tokenUsageSchema.optional(),
	}),
	baseProviderEventDataSchema.extend({
		type: z.literal('response.completed'),
		response: responseEnvelopeSchema,
	}),
	baseProviderEventDataSchema.extend({
		type: z.literal('error'),
		error: serializedErrorSchema,
	}),
])

/**
 * SSE chunk schema emitted by AI stream endpoints.
 *
 * @example
 * ```json
 * {
 *   "event": "response.output_text.delta",
 *   "data": {
 *     "type": "response.output_text.delta",
 *     "sequence_number": 2,
 *     "response_id": "run_123",
 *     "run_id": "run_123",
 *     "stream_id": "model_abc",
 *     "delta": "hello"
 *   }
 * }
 * ```
 */
export const agentSseEventSchema = z.object({
	event: z.string(),
	data: agentProviderEventDataSchema,
})

export type AgentProviderEventData = z.infer<typeof agentProviderEventDataSchema>
export type AgentSseEvent = z.infer<typeof agentSseEventSchema>

/**
 * Map one PURISTA agent run event to its provider-style SSE chunk.
 *
 * Returns `undefined` for run events that have no provider projection (for
 * example a future harness event type that this core version does not yet
 * model). Callers skip `undefined` chunks instead of failing the stream; the
 * raw run event still flows through the agent run-event bus.
 */
export function createProviderSseEvent(
	input: AgentRunEvent,
	sequenceNumber: number,
	modelChunkVisibility: AgentModelChunkVisibility = 'full',
): AgentSseEvent | undefined {
	const data = mapRunEventToProviderEvent(input.event, sequenceNumber, modelChunkVisibility)
	if (!data) {
		return undefined
	}
	return {
		event: data.type,
		data,
	}
}

function mapRunEventToProviderEvent(
	event: RunEvent,
	sequenceNumber: number,
	modelChunkVisibility: AgentModelChunkVisibility,
): AgentProviderEventData | undefined {
	if (modelChunkVisibility === 'off' && event.type !== 'run.finished') {
		return undefined
	}

	if (modelChunkVisibility === 'safe' && !isSafeClientEvent(event)) {
		return undefined
	}

	const responseId = event.runId
	const base = {
		sequence_number: sequenceNumber,
		response_id: responseId,
		run_id: event.runId,
		...('agentId' in event && event.agentId ? { agent_id: event.agentId } : {}),
		...('workflowId' in event && event.workflowId ? { workflow_id: event.workflowId } : {}),
		...('modelAlias' in event && event.modelAlias ? { model_alias: event.modelAlias } : {}),
		...('streamId' in event && event.streamId ? { stream_id: event.streamId } : {}),
	}

	switch (event.type) {
		case 'run.started':
			return {
				...base,
				type: 'response.created',
				response: responseEnvelope(event.runId, 'in_progress', event.at),
			}
		case 'agent.started':
			return {
				...base,
				type: 'response.in_progress',
				response: responseEnvelope(event.runId, 'in_progress', event.at, { agentId: event.agentId }),
			}
		case 'model.delta':
			return {
				...base,
				type: 'response.output_text.delta',
				output_index: 0,
				content_index: 0,
				delta: event.delta,
			}
		case 'policy.evaluated':
		case 'policy.exposure':
		case 'approval.requested':
		case 'approval.finished':
			return {
				...base,
				type: 'response.output_json.delta',
				output_index: 0,
				content_index: 0,
				delta: event,
			}
		case 'model.object.partial':
			return {
				...base,
				type: 'response.output_json.delta',
				output_index: 0,
				content_index: 0,
				delta: event.partial,
			}
		case 'model.object':
			return {
				...base,
				type: 'response.output_json.done',
				output_index: 0,
				content_index: 0,
				object: event.object,
			}
		case 'tool.started':
			return {
				...base,
				type: 'response.tool_call.started',
				item_id: event.callId,
				tool_name: event.toolId,
				...(modelChunkVisibility === 'full' ? { input: event.input } : {}),
			}
		case 'tool.finished':
			return {
				...base,
				type: 'response.tool_call.completed',
				item_id: event.callId,
				tool_name: event.toolId,
				...(modelChunkVisibility === 'full' && event.output !== undefined ? { output: event.output } : {}),
				...(modelChunkVisibility === 'full' && event.error ? { error: event.error } : {}),
			}
		case 'model.embedding.completed':
			return {
				...base,
				type: 'response.model_embedding.completed',
				count: event.count,
				...(event.dimensions !== undefined ? { dimensions: event.dimensions } : {}),
				...(event.usage ? { usage: event.usage } : {}),
			}
		case 'model.rerank.completed':
			return {
				...base,
				type: 'response.model_rerank.completed',
				count: event.count,
				...(event.topN !== undefined ? { top_n: event.topN } : {}),
				...(event.usage ? { usage: event.usage } : {}),
			}
		case 'run.finished':
			return event.error
				? {
						...base,
						type: 'error',
						error:
							modelChunkVisibility === 'full'
								? event.error
								: {
										code: event.error.code,
										category: event.error.category,
										retriable: event.error.retriable,
										message: 'Agent run failed.',
									},
					}
				: {
						...base,
						type: 'response.completed',
						response: responseEnvelope(event.runId, 'completed', event.at, undefined, event.output),
					}
		case 'agent.finished':
			return event.error
				? {
						...base,
						type: 'error',
						error: event.error,
					}
				: {
						...base,
						type: 'response.in_progress',
						response: responseEnvelope(event.runId, 'in_progress', event.at, { agentId: event.agentId }, event.output),
					}
		case 'model.message':
			return {
				...base,
				type: 'response.output_json.delta',
				output_index: 0,
				content_index: 0,
				delta: event.message,
			}
		case 'stream.overflow':
			return {
				...base,
				type: 'error',
				error: {
					code: 'STREAM_OVERFLOW',
					category: 'stream',
					retriable: true,
					message: `Stream dropped ${event.dropped} events.`,
				},
			}
		default:
			// A run event with no provider projection (e.g. a future harness event
			// type). Skip it in the SSE projection rather than crash the stream.
			return undefined
	}
}

function isSafeClientEvent(event: RunEvent): boolean {
	switch (event.type) {
		case 'run.started':
		case 'run.finished':
		case 'agent.started':
		case 'model.delta':
		case 'model.object.partial':
		case 'model.object':
		case 'tool.started':
		case 'tool.finished':
			return true
		default:
			return false
	}
}

function responseEnvelope(
	runId: string,
	status: 'in_progress' | 'completed',
	at: string,
	metadata?: Record<string, unknown>,
	output?: unknown,
) {
	return {
		id: runId,
		object: 'response' as const,
		status,
		created_at: Math.floor(new Date(at).getTime() / 1000),
		...(output !== undefined ? { output } : {}),
		...(metadata ? { metadata } : {}),
	}
}
