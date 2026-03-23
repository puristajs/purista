import { extendApi } from '@purista/core'
import { z } from 'zod'
import type { AgentSseProtocol } from '../types/AgentManifest.js'

export const sseProtocolEventSchema = extendApi(
	z.object({
		event: z.string(),
		data: z.unknown(),
	}),
	{ title: 'AgentSseProtocolEvent' },
)

export const getSseProtocolDocumentationUrl = (protocol: AgentSseProtocol): string | undefined => {
	if (protocol === 'ai-sdk-responses') {
		return 'https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol#openai-compatible-stream'
	}
	if (protocol === 'ai-sdk-ui-message' || protocol === 'ai-sdk-data' || protocol === 'ai-sdk-json-render') {
		return 'https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol'
	}
	if (protocol === 'agent2agent') {
		return 'https://google.github.io/A2A/'
	}
	if (protocol === 'mcp') {
		return 'https://modelcontextprotocol.io/specification/2025-06-18/'
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
