import type { AgentSseProtocol } from '../types/AgentManifest.js'
import { toAiSdkStreamEvents } from './aiSdkStream.js'
import { toAgent2AgentReferenceMessage, toMcpReferenceToolResult } from './interoperability.js'
import type { AgentProtocolEnvelope } from './types.js'

export type ProtocolSseEvent = {
	event: string
	data: unknown
}

/**
 * Converts PURISTA protocol envelopes to protocol-specific SSE events.
 * This allows endpoint consumers to select an interoperable stream protocol
 * without app-layer custom adapters.
 */
export const toProtocolSseEvents = async function* (
	envelopes: AgentProtocolEnvelope[],
	protocol: Exclude<AgentSseProtocol, 'purista'>,
): AsyncGenerator<ProtocolSseEvent> {
	if (protocol === 'ai-sdk-responses') {
		for await (const event of toAiSdkStreamEvents(envelopes, { mode: 'responses' })) {
			yield event
		}
		return
	}

	const mapJsonRenderDataPart = (envelope: AgentProtocolEnvelope) => {
		const frame = envelope.frame
		if (frame.kind !== 'artifact') {
			return undefined
		}
		const content = frame.content
		if (typeof content === 'object' && content !== null) {
			if ('op' in content && 'path' in content) {
				return {
					type: 'data-spec' as const,
					data: {
						type: 'patch' as const,
						patch: content,
					},
				}
			}
			if ('root' in content && 'elements' in content) {
				return {
					type: 'data-spec' as const,
					data: {
						type: 'flat' as const,
						spec: content,
					},
				}
			}
			return {
				type: 'data-spec' as const,
				data: {
					type: 'nested' as const,
					spec: content,
				},
			}
		}
		return undefined
	}

	if (protocol === 'ai-sdk-ui-message' || protocol === 'ai-sdk-data' || protocol === 'ai-sdk-json-render') {
		for await (const event of toAiSdkStreamEvents(envelopes, {
			mode: 'ui-message',
			uiMessage:
				protocol === 'ai-sdk-json-render'
					? {
							emitMessageMetadata: true,
							mapDataParts: ({ envelope }) => mapJsonRenderDataPart(envelope),
						}
					: {
							emitMessageMetadata: true,
						},
		})) {
			yield event
		}
		yield { event: 'data', data: '[DONE]' }
		return
	}

	if (protocol === 'agent2agent') {
		for (const envelope of envelopes) {
			yield {
				event: 'message',
				data: toAgent2AgentReferenceMessage(envelope) as Record<string, unknown>,
			}
		}
		return
	}

	yield {
		event: 'result',
		data: toMcpReferenceToolResult(envelopes) as Record<string, unknown>,
	}
}
