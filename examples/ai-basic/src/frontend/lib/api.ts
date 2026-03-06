import { readSseStream } from './sse'
import type { AgentProtocolEnvelope, StreamFrameEvent, StreamPayload } from './types'

type StreamCallbacks = {
	onEnvelope: (envelope: AgentProtocolEnvelope) => void
	onPayload: (payload: StreamPayload) => void
	onComplete: (final: { message?: string; envelopes?: AgentProtocolEnvelope[] } | undefined) => void
	onError: (error: string) => void
}

const toEnvelopes = (value: unknown): AgentProtocolEnvelope[] => {
	if (Array.isArray(value)) {
		return value as AgentProtocolEnvelope[]
	}
	if (value && typeof value === 'object') {
		return [value as AgentProtocolEnvelope]
	}
	return []
}

const isChunkFrame = (frame: StreamFrameEvent): frame is Extract<StreamFrameEvent, { frameType: 'chunk' }> =>
	frame.frameType === 'chunk'

const isCompleteFrame = (frame: StreamFrameEvent): frame is Extract<StreamFrameEvent, { frameType: 'complete' }> =>
	frame.frameType === 'complete'

const isErrorFrame = (frame: StreamFrameEvent): frame is Extract<StreamFrameEvent, { frameType: 'error' }> =>
	frame.frameType === 'error'

export const streamSupportAgent = async (
	payload: { prompt: string; sessionId?: string; responseFormat?: 'text' | 'json' },
	callbacks: StreamCallbacks,
): Promise<void> => {
	const response = await fetch('/api/v1/support/ask/stream', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	})
	if (!response.ok) {
		callbacks.onError(`HTTP ${response.status}`)
		return
	}

	let seenChunk = false
	await readSseStream(response, streamPayload => {
		callbacks.onPayload(streamPayload)
		const parsed = streamPayload.parsed
		if (!parsed) {
			return
		}
		if (isChunkFrame(parsed)) {
			const envelopes = toEnvelopes(parsed.chunk)
			if (envelopes.length > 0) {
				seenChunk = true
			}
			for (const envelope of envelopes) {
				callbacks.onEnvelope(envelope)
			}
			return
		}
		if (isCompleteFrame(parsed)) {
			if (!seenChunk && parsed.final?.envelopes) {
				for (const envelope of parsed.final.envelopes) {
					callbacks.onEnvelope(envelope)
				}
			}
			callbacks.onComplete(parsed.final)
			return
		}
		if (isErrorFrame(parsed)) {
			callbacks.onError(JSON.stringify(parsed.error ?? 'stream error'))
		}
	})
}

export const runSupportCommand = async (payload: { prompt: string; sessionId?: string }) => {
	const response = await fetch('/api/v1/support/ask', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	})
	if (!response.ok) {
		const text = await response.text()
		throw new Error(text || `HTTP ${response.status}`)
	}
	return (await response.json()) as unknown
}

export const runSupportMcp = async (payload: {
	name: string
	arguments?: Record<string, unknown>
}) => {
	const response = await fetch('/api/v1/support/mcp/call', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	})
	if (!response.ok) {
		const text = await response.text()
		throw new Error(text || `HTTP ${response.status}`)
	}
	return (await response.json()) as unknown
}

export const runSupportA2a = async (payload: { prompt: string; sessionId?: string; responseFormat?: 'text' | 'json' }) => {
	const response = await fetch('/api/v1/support/a2a/call', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	})
	if (!response.ok) {
		const text = await response.text()
		throw new Error(text || `HTTP ${response.status}`)
	}
	return (await response.json()) as unknown
}

export const getMcpTools = async () => {
	const response = await fetch('/api/v1/support/mcp/tools', {
		method: 'GET',
		headers: { accept: 'application/json' },
	})
	if (!response.ok) {
		const text = await response.text()
		throw new Error(text || `HTTP ${response.status}`)
	}
	return (await response.json()) as unknown
}

export const loadConversation = async (sessionId: string) => {
	const response = await fetch('/api/v1/support/conversation', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ sessionId }),
	})
	return (await response.json()) as {
		sessionId?: string
		conversationId?: string
		envelopes?: AgentProtocolEnvelope[]
	}
}
