import { extendApi } from '@purista/core'
import { z } from 'zod'
import type { AgentStreamProtocolAdapterId } from '../types/AgentManifest.js'

export const sseProtocolEventSchema = extendApi(
	z.object({
		event: z.string(),
		data: z.unknown(),
	}),
	{ title: 'AgentSseProtocolEvent' },
)

export const getSseProtocolDocumentationUrl = (protocol: AgentStreamProtocolAdapterId): string | undefined => {
	if (protocol === 'ai-sdk.ui-message') {
		return 'https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol'
	}
	if (protocol === 'ai-sdk.responses') {
		return 'https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text'
	}
	return undefined
}

export const isTerminalProtocolEvent = (event: { event: string; data: unknown }): boolean => {
	if (event.event === 'data') {
		if (event.data === '[DONE]') {
			return true
		}
		if (event.data && typeof event.data === 'object') {
			const maybeType = (event.data as { type?: unknown }).type
			return maybeType === 'finish' || maybeType === 'abort'
		}
		return false
	}
	return event.event === 'response.completed' || event.event === 'response.error'
}
