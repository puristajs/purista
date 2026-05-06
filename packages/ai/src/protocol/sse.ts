import type { AgentStreamProtocolAdapterId } from '../types/AgentManifest.js'
import { toAiSdkStreamEvents } from './aiSdkStream.js'
import type { AgentProtocolEnvelope, WireEvent } from './types.js'

export type ProtocolSseEvent = {
	event: string
	data: unknown
}

export type AiSdkMode = 'responses' | 'ui-message'

export interface AiSdkStreamOptions {
	mode?: AiSdkMode
	emitMessageMetadata?: boolean
	mapDataParts?: (envelope: AgentProtocolEnvelope) => { type: `data-${string}`; data: unknown } | undefined
}

/**
 * Converts PURISTA protocol envelopes to protocol-specific SSE events.
 * This allows endpoint consumers to select an interoperable stream protocol
 * without app-layer custom adapters.
 */
export const toProtocolSseEvents = async function* (
	envelopes: AsyncIterable<AgentProtocolEnvelope> | Iterable<AgentProtocolEnvelope>,
	protocol: AgentStreamProtocolAdapterId,
	options?: AiSdkStreamOptions,
): AsyncGenerator<WireEvent> {
	if (protocol === 'ai-sdk.responses' || protocol === 'ai-sdk.ui-message') {
		const mode = protocol === 'ai-sdk.responses' ? 'responses' : 'ui-message'
		const useMetadata = options?.emitMessageMetadata ?? false
		const mapParts = options?.mapDataParts

		for await (const event of toAiSdkStreamEvents(envelopes, {
			mode,
			uiMessage: {
				emitMessageMetadata: useMetadata,
				mapDataParts: mapParts ? ({ envelope }) => mapParts(envelope) : undefined,
			},
		})) {
			yield event
		}
		if (mode === 'ui-message') {
			yield { event: 'data', data: '[DONE]' }
		}
		return
	}

	for await (const envelope of envelopes) {
		yield {
			event: 'message',
			data: envelope,
		}
	}
}
