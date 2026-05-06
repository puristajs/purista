import { randomUUID } from 'node:crypto'
import {
	isPuristaAiTaskArtifactId,
	isPuristaAiTaskChunkArtifactId,
	PURISTA_AI_PLAN_ARTIFACT_ID,
	PURISTA_AI_PLAN_STATUS_ARTIFACT_ID,
	PURISTA_AI_WORKFLOW_STAGE_ARTIFACT_ID,
} from './taskArtifacts.js'
import type { AgentProtocolEnvelope, AgentProtocolFrame } from './types.js'

export type AiSdkStreamEvent = {
	event: string
	data: Record<string, unknown>
}

/**
 * Output mode for `toAiSdkStreamEvents`.
 *
 * - `responses`: emits OpenAI Responses-style `response.*` events.
 * - `ui-message`: emits Vercel UI Message stream events (`start`, `text-*`, `finish`, `error`).
 */
export type AiSdkStreamMode = 'responses' | 'ui-message'

/**
 * Generic AI SDK UI data part.
 * The `type` must follow the `data-*` convention used by AI SDK UI message streams.
 */
export type AiSdkUiDataPart = {
	type: `data-${string}`
	id?: string
} & Record<string, unknown>

/**
 * Context passed to UI data-part mappers.
 */
export type AiSdkUiDataPartMapperInput = {
	envelope: AgentProtocolEnvelope
	frame: AgentProtocolFrame
	response: {
		id: string
		conversationId: string
		agent?: {
			name?: string
			version?: string
		}
	}
}

export type AiSdkUiDataPartMapper = (
	input: AiSdkUiDataPartMapperInput,
) => AiSdkUiDataPart | AiSdkUiDataPart[] | undefined

export type ToAiSdkUiMessageOptions = {
	/**
	 * When `true` (default), non-message frames are also emitted as `message-metadata`.
	 * Set to `false` when consumers only want explicit mapped data parts.
	 */
	emitMessageMetadata?: boolean
	/**
	 * Optional mapping hook to emit typed `data-*` parts for application-specific UI state.
	 * This is useful for custom dashboards (status, artifacts, tickets, etc.) while still
	 * using the built-in protocol conversion for text/error lifecycle events.
	 */
	mapDataParts?: AiSdkUiDataPartMapper
	/**
	 * Controls how protocol `error` frames are represented in UI-message streams.
	 *
	 * - `auto` (default): handled errors become `data-agent-error` parts; unhandled errors emit `error`.
	 * - `error-event`: always emit `error` and terminate stream.
	 * - `data-part`: always emit `data-agent-error` and keep stream lifecycle events.
	 */
	errorMode?: 'auto' | 'error-event' | 'data-part'
}

export type ToAiSdkStreamOptions = {
	mode?: AiSdkStreamMode
	uiMessage?: ToAiSdkUiMessageOptions
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

const mapUiDataPartEvents = (input: AiSdkUiDataPart | AiSdkUiDataPart[] | undefined): AiSdkStreamEvent[] => {
	if (!input) {
		return []
	}
	const entries = Array.isArray(input) ? input : [input]
	return entries.map(entry => ({
		event: 'data',
		data: {
			id: entry.id ?? randomUUID(),
			...entry,
		},
	}))
}

const getString = (value: unknown): string | undefined =>
	typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined

const isLikelyUrl = (value: string) => /^https?:\/\/\S+$/i.test(value)

const trimDash = (value: string): string => {
	let start = 0
	let end = value.length
	while (start < end && value[start] === '-') {
		start += 1
	}
	while (end > start && value[end - 1] === '-') {
		end -= 1
	}
	return value.slice(start, end)
}

const toUiDataType = (artifactId: string) => {
	if (artifactId === PURISTA_AI_PLAN_ARTIFACT_ID) {
		return 'data-purista-ai-plan' as const
	}
	if (artifactId === PURISTA_AI_PLAN_STATUS_ARTIFACT_ID) {
		return 'data-purista-ai-plan-status' as const
	}
	if (artifactId === PURISTA_AI_WORKFLOW_STAGE_ARTIFACT_ID) {
		return 'data-purista-ai-workflow-stage' as const
	}
	if (isPuristaAiTaskArtifactId(artifactId)) {
		return 'data-purista-ai-task' as const
	}
	if (isPuristaAiTaskChunkArtifactId(artifactId)) {
		return 'data-purista-ai-task-chunk' as const
	}
	const collapsed = artifactId
		.trim()
		.toLowerCase()
		.replaceAll(/[^a-z0-9-]+/g, '-')
	const normalized = trimDash(collapsed)
	return `data-${normalized || 'artifact'}` as const
}

const toArtifactDataPayload = (frame: Extract<AgentProtocolFrame, { kind: 'artifact' }>) => {
	if (typeof frame.content === 'object' && frame.content !== null) {
		return frame.content
	}
	if (typeof frame.content === 'string' && frame.mimeType?.includes('json')) {
		try {
			return JSON.parse(frame.content) as Record<string, unknown>
		} catch {
			return frame.content
		}
	}
	return frame.content
}

/**
 * Converts PURISTA protocol envelopes into SSE events compatible with AI SDK transports.
 *
 * By default (`mode: 'responses'`) it emits `response.*` events.
 * In `mode: 'ui-message'` it emits UI Message stream events and can additionally map
 * protocol frames into typed `data-*` parts via `uiMessage.mapDataParts`.
 */
export const toAiSdkStreamEvents = async function* (
	source: Iterable<AgentProtocolEnvelope> | AsyncIterable<AgentProtocolEnvelope>,
	options: ToAiSdkStreamOptions = {},
): AsyncGenerator<AiSdkStreamEvent> {
	const mode = options.mode ?? 'responses'
	const emitMessageMetadata = options.uiMessage?.emitMessageMetadata ?? true
	const uiErrorMode = options.uiMessage?.errorMode ?? 'auto'
	let responseMeta: ResponseMeta | undefined
	let created = false
	let finalText = ''
	let summary: string | undefined
	let telemetry: Record<string, unknown> | undefined
	let textId = `text-${randomUUID()}`
	let startedMessage = false
	let startedText = false
	let stepOpen = false
	let reasoningId = `reasoning-${randomUUID()}`
	let startedReasoning = false
	const toolCallByName = new Map<string, string>()
	let toolSequence = 0

	const ensureUiMessageStarted = async function* () {
		if (startedMessage) {
			return
		}
		yield {
			event: 'data',
			data: {
				type: 'start',
			},
		}
		startedMessage = true
	}

	const ensureUiTextStarted = async function* () {
		yield* ensureUiStepStarted()
		if (startedText) {
			return
		}
		textId = `text-${randomUUID()}`
		yield {
			event: 'data',
			data: {
				type: 'text-start',
				id: textId,
			},
		}
		startedText = true
	}

	const ensureUiStepStarted = async function* () {
		yield* ensureUiMessageStarted()
		if (stepOpen) {
			return
		}
		yield {
			event: 'data',
			data: {
				type: 'start-step',
			},
		}
		stepOpen = true
	}

	const finishUiStep = async function* () {
		if (!stepOpen) {
			return
		}
		if (startedText) {
			yield {
				event: 'data',
				data: {
					type: 'text-end',
					id: textId,
				},
			}
			startedText = false
			textId = `text-${randomUUID()}`
		}
		yield {
			event: 'data',
			data: {
				type: 'finish-step',
			},
		}
		stepOpen = false
	}

	for await (const envelope of iterateEnvelopes(source)) {
		if (!responseMeta) {
			responseMeta = createResponseMeta(envelope)
		}

		if (!created) {
			if (mode === 'responses') {
				yield {
					event: 'response.created',
					data: {
						type: 'response.created',
						response: responseMeta,
					},
				}
			}
			created = true
		}

		switch (envelope.frame.kind) {
			case 'message':
				if (mode === 'responses') {
					yield {
						event: 'response.output_text.delta',
						data: {
							type: 'response.output_text.delta',
							delta: { text: envelope.frame.content, partial: envelope.frame.partial ?? false },
							response: responseMeta,
						},
					}
				} else {
					if (!startedText && envelope.frame.content.length > 0) {
						yield* ensureUiTextStarted()
					}
					if (envelope.frame.content.length > 0) {
						yield {
							event: 'data',
							data: {
								type: 'text-delta',
								id: textId,
								delta: envelope.frame.content,
							},
						}
					}
					if (envelope.frame.final) {
						if (!startedText) {
							yield* ensureUiTextStarted()
						}
						yield {
							event: 'data',
							data: {
								type: 'text-end',
								id: textId,
							},
						}
						startedText = false
						textId = `text-${randomUUID()}`
						yield* finishUiStep()
					}
				}
				if (envelope.frame.final) {
					finalText = envelope.frame.content
				}
				if (envelope.frame.summary) {
					summary = envelope.frame.summary
				}
				break
			case 'artifact':
				if (mode === 'responses') {
					yield {
						event: 'response.metadata.delta',
						data: buildMetadataEvent(envelope.frame),
					}
				} else {
					const sourceId = envelope.frame.artifactId
					const mimeTypeFromFrame = getString(envelope.frame.mimeType)
					const artifactObject =
						typeof envelope.frame.content === 'object' && envelope.frame.content !== null
							? (envelope.frame.content as Record<string, unknown>)
							: undefined
					const artifactText = getString(envelope.frame.content)

					const typed = getString(artifactObject?.type)
					const url =
						getString(artifactObject?.url) ?? (artifactText && isLikelyUrl(artifactText) ? artifactText : undefined)
					const mediaType = getString(artifactObject?.mediaType) ?? mimeTypeFromFrame
					const title = getString(artifactObject?.title)

					if (typed === 'source-url' && url) {
						yield {
							event: 'data',
							data: {
								type: 'source-url',
								sourceId,
								url,
							},
						}
					} else if (typed === 'source-document' && mediaType && title) {
						yield {
							event: 'data',
							data: {
								type: 'source-document',
								sourceId,
								mediaType,
								title,
							},
						}
						if (url) {
							yield {
								event: 'data',
								data: {
									type: 'source-url',
									sourceId,
									url,
								},
							}
						}
					} else if (typed === 'file' && url && mediaType) {
						yield {
							event: 'data',
							data: {
								type: 'file',
								url,
								mediaType,
							},
						}
					} else {
						const shouldEmitFile = Boolean(
							url &&
								mediaType &&
								(typed === 'file' ||
									mediaType.startsWith('image/') ||
									mediaType.startsWith('audio/') ||
									mediaType.startsWith('video/') ||
									mediaType === 'application/pdf'),
						)
						if (shouldEmitFile) {
							yield {
								event: 'data',
								data: {
									type: 'file',
									url,
									mediaType,
								},
							}
						}
					}

					if (envelope.frame.artifactId === 'reasoning' && typeof envelope.frame.content === 'string') {
						if (!startedReasoning) {
							reasoningId = envelope.messageId
							startedReasoning = true
							yield {
								event: 'data',
								data: {
									type: 'reasoning-start',
									id: reasoningId,
								},
							}
						}
						yield {
							event: 'data',
							data: {
								type: 'reasoning-delta',
								id: reasoningId,
								delta: envelope.frame.content,
							},
						}
						if (envelope.frame.phase === 'final' || envelope.frame.lastChunk) {
							yield {
								event: 'data',
								data: {
									type: 'reasoning-end',
									id: reasoningId,
								},
							}
							startedReasoning = false
						}
					}
					const defaultArtifactDataPart = {
						type: toUiDataType(envelope.frame.artifactId),
						data: toArtifactDataPayload(envelope.frame),
					}
					for (const mapped of mapUiDataPartEvents(defaultArtifactDataPart)) {
						yield mapped
					}
					for (const mapped of mapUiDataPartEvents(
						options.uiMessage?.mapDataParts?.({
							envelope,
							frame: envelope.frame,
							response: {
								id: responseMeta?.id ?? envelope.messageId,
								conversationId: responseMeta?.conversationId ?? envelope.conversationId,
								agent: responseMeta?.agent,
							},
						}),
					)) {
						yield mapped
					}
					if (emitMessageMetadata) {
						yield {
							event: 'data',
							data: {
								type: 'message-metadata',
								messageMetadata: envelope.frame,
							},
						}
					}
				}
				break
			case 'tool':
				if (mode === 'responses') {
					yield {
						event: 'response.metadata.delta',
						data: buildMetadataEvent(envelope.frame),
					}
				} else {
					const toolName = envelope.frame.toolName
					let toolCallId = toolCallByName.get(toolName)
					if (!toolCallId) {
						toolSequence += 1
						toolCallId = `${envelope.messageId}:${toolSequence}`
						toolCallByName.set(toolName, toolCallId)
					}
					if (envelope.frame.status === 'invoked') {
						yield* ensureUiStepStarted()
						yield {
							event: 'data',
							data: {
								type: 'tool-input-start',
								toolCallId,
								toolName,
							},
						}
						if (envelope.frame.input !== undefined) {
							const inputText =
								typeof envelope.frame.input === 'string' ? envelope.frame.input : JSON.stringify(envelope.frame.input)
							if (inputText) {
								yield {
									event: 'data',
									data: {
										type: 'tool-input-delta',
										toolCallId,
										inputTextDelta: inputText,
									},
								}
							}
						}
						yield {
							event: 'data',
							data: {
								type: 'tool-input-available',
								toolCallId,
								toolName,
								input: envelope.frame.input,
							},
						}
					}
					if (envelope.frame.status === 'success') {
						yield {
							event: 'data',
							data: {
								type: 'tool-output-available',
								toolCallId,
								output: envelope.frame.output,
							},
						}
						yield* finishUiStep()
					}
					if (envelope.frame.status === 'error') {
						yield {
							event: 'data',
							data: {
								type: 'tool-output-error',
								toolCallId,
								errorText: envelope.frame.message || 'Tool execution failed',
							},
						}
						yield* finishUiStep()
					}
					for (const mapped of mapUiDataPartEvents(
						options.uiMessage?.mapDataParts?.({
							envelope,
							frame: envelope.frame,
							response: {
								id: responseMeta?.id ?? envelope.messageId,
								conversationId: responseMeta?.conversationId ?? envelope.conversationId,
								agent: responseMeta?.agent,
							},
						}),
					)) {
						yield mapped
					}
					if (emitMessageMetadata) {
						yield {
							event: 'data',
							data: {
								type: 'message-metadata',
								messageMetadata: envelope.frame,
							},
						}
					}
				}
				break
			case 'telemetry':
				telemetry = {
					usage: envelope.frame.usage,
					durationMs: envelope.frame.durationMs,
					waitTimeMs: envelope.frame.waitTimeMs,
					poolId: envelope.frame.poolId,
					maxConcurrencyPerInstance: envelope.frame.maxConcurrencyPerInstance,
					activeWorkers: envelope.frame.activeWorkers,
					waitingWorkers: envelope.frame.waitingWorkers,
					replicaCountHint: envelope.frame.replicaCountHint,
					effectiveMaxConcurrencyHint: envelope.frame.effectiveMaxConcurrencyHint,
					provider: envelope.frame.provider,
				}
				if (mode === 'responses') {
					yield {
						event: 'response.metadata.delta',
						data: buildMetadataEvent(envelope.frame),
					}
				} else {
					for (const mapped of mapUiDataPartEvents(
						options.uiMessage?.mapDataParts?.({
							envelope,
							frame: envelope.frame,
							response: {
								id: responseMeta?.id ?? envelope.messageId,
								conversationId: responseMeta?.conversationId ?? envelope.conversationId,
								agent: responseMeta?.agent,
							},
						}),
					)) {
						yield mapped
					}
					if (emitMessageMetadata) {
						yield {
							event: 'data',
							data: {
								type: 'message-metadata',
								messageMetadata: envelope.frame,
							},
						}
					}
				}
				break
			case 'error':
				if (mode === 'responses') {
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
				} else {
					const errorAsDataPart = {
						type: 'data-agent-error' as const,
						data: {
							code: envelope.frame.code,
							message: envelope.frame.message,
							handled: envelope.frame.handled ?? false,
							details: envelope.frame.details,
						},
					}
					const shouldEmitErrorEvent =
						uiErrorMode === 'error-event' || (uiErrorMode === 'auto' && (envelope.frame.handled ?? false) !== true)
					if (!shouldEmitErrorEvent) {
						for (const mapped of mapUiDataPartEvents(errorAsDataPart)) {
							yield mapped
						}
						if (emitMessageMetadata) {
							yield {
								event: 'data',
								data: {
									type: 'message-metadata',
									messageMetadata: envelope.frame,
								},
							}
						}
						break
					}
					yield {
						event: 'data',
						data: {
							type: 'error',
							errorText: envelope.frame.message,
						},
					}
					return
				}
				return
		}
	}

	const completedMeta = responseMeta ?? fallbackMeta()

	if (!created && mode === 'responses') {
		yield {
			event: 'response.created',
			data: {
				type: 'response.created',
				response: completedMeta,
			},
		}
	}

	if (mode === 'responses') {
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
	} else {
		if (startedText) {
			yield {
				event: 'data',
				data: {
					type: 'text-end',
					id: textId,
				},
			}
			startedText = false
		}
		yield* finishUiStep()
		if (startedReasoning) {
			yield {
				event: 'data',
				data: {
					type: 'reasoning-end',
					id: reasoningId,
				},
			}
		}
		yield {
			event: 'data',
			data: {
				type: 'finish',
				finishReason: 'stop',
				messageMetadata:
					summary || telemetry
						? {
								...(summary ? { summary } : {}),
								...(telemetry ? { telemetry } : {}),
							}
						: undefined,
			},
		}
	}
}
