import { randomUUID } from 'node:crypto'

import type { AgentProtocolEnvelope, AgentProtocolFrame } from './types.js'

export type AiSdkStreamEvent = {
	event: string
	data: Record<string, unknown>
}

type ResponseMeta = {
	id: string
	status: 'in_progress' | 'completed' | 'errored'
	conversationId: string
	agent?: {
		name?: string
		version?: string
	}
}

const createResponseMeta = (
	envelope: AgentProtocolEnvelope,
	status: ResponseMeta['status'] = 'in_progress',
): ResponseMeta => ({
	id: envelope.messageId,
	status,
	conversationId: envelope.conversationId,
	agent: {
		name: envelope.actor.agent ?? envelope.actor.service,
		version: envelope.actor.version,
	},
})

const fallbackMeta = (): ResponseMeta => ({
	id: `response-${randomUUID()}`,
	status: 'in_progress',
	conversationId: `conversation-${randomUUID()}`,
})

const isAsyncIterable = (
	input: Iterable<AgentProtocolEnvelope> | AsyncIterable<AgentProtocolEnvelope>,
): input is AsyncIterable<AgentProtocolEnvelope> =>
	typeof (input as AsyncIterable<AgentProtocolEnvelope>)[Symbol.asyncIterator] === 'function'

const iterateEnvelopes = async function* (
	source: Iterable<AgentProtocolEnvelope> | AsyncIterable<AgentProtocolEnvelope>,
) {
	if (isAsyncIterable(source)) {
		for await (const envelope of source) {
			yield envelope
		}
		return
	}

	for (const envelope of source as Iterable<AgentProtocolEnvelope>) {
		yield envelope
	}
}

const buildMetadataEvent = (frame: AgentProtocolFrame) => ({
	type: 'response.metadata.delta',
	metadata: frame,
})

/**
 * Converts protocol envelopes into the SSE events defined by the Vercel AI SDK stream protocol.
 */
export const toAiSdkStreamEvents = async function* (
	source: Iterable<AgentProtocolEnvelope> | AsyncIterable<AgentProtocolEnvelope>,
): AsyncGenerator<AiSdkStreamEvent> {
	let responseMeta: ResponseMeta | undefined
	let created = false
	let finalText = ''
	let summary: string | undefined
	let telemetry: Record<string, unknown> | undefined

	for await (const envelope of iterateEnvelopes(source)) {
		if (!responseMeta) {
			responseMeta = createResponseMeta(envelope)
		}

		if (!created) {
			yield {
				event: 'response.created',
				data: {
					type: 'response.created',
					response: responseMeta,
				},
			}
			created = true
		}

		switch (envelope.frame.kind) {
			case 'message':
				yield {
					event: 'response.output_text.delta',
					data: {
						type: 'response.output_text.delta',
						delta: { text: envelope.frame.content, partial: envelope.frame.partial ?? false },
						response: responseMeta,
					},
				}
				if (envelope.frame.final) {
					finalText = envelope.frame.content
				}
				if (envelope.frame.summary) {
					summary = envelope.frame.summary
				}
				break
			case 'artifact':
				yield {
					event: 'response.metadata.delta',
					data: buildMetadataEvent(envelope.frame),
				}
				break
			case 'tool':
				yield {
					event: 'response.metadata.delta',
					data: buildMetadataEvent(envelope.frame),
				}
				break
			case 'telemetry':
				telemetry = {
					usage: envelope.frame.usage,
					durationMs: envelope.frame.durationMs,
					waitTimeMs: envelope.frame.waitTimeMs,
					poolId: envelope.frame.poolId,
					maxWorkersPerInstance: envelope.frame.maxWorkersPerInstance,
					activeWorkers: envelope.frame.activeWorkers,
					waitingWorkers: envelope.frame.waitingWorkers,
					replicaCountHint: envelope.frame.replicaCountHint,
					effectiveMaxConcurrencyHint: envelope.frame.effectiveMaxConcurrencyHint,
					provider: envelope.frame.provider,
				}
				yield {
					event: 'response.metadata.delta',
					data: buildMetadataEvent(envelope.frame),
				}
				break
			case 'error':
				yield {
					event: 'response.error',
					data: {
						type: 'response.error',
						error: {
							code: envelope.frame.code,
							message: envelope.frame.message,
							handled: envelope.frame.handled,
						},
						response: {
							...(responseMeta ?? fallbackMeta()),
							status: 'errored',
						},
					},
				}
				return
		}
	}

	const completedMeta = responseMeta ?? fallbackMeta()

	if (!created) {
		yield {
			event: 'response.created',
			data: {
				type: 'response.created',
				response: completedMeta,
			},
		}
	}

	yield {
		event: 'response.completed',
		data: {
			type: 'response.completed',
			response: { ...completedMeta, status: 'completed' },
			output_text: finalText,
			summary,
			telemetry,
		},
	}
}
