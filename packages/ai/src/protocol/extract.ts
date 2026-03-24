import type { AgentProtocolEnvelope } from './types.js'

export const toFrameRecord = (envelope: AgentProtocolEnvelope | undefined): Record<string, unknown> | null => {
	const frame = envelope?.frame
	if (!frame || typeof frame !== 'object') {
		return null
	}
	return frame as Record<string, unknown>
}

export const extractFinalAssistantText = (envelopes: AgentProtocolEnvelope[]): string => {
	const assistantFrames = envelopes
		.map(envelope => toFrameRecord(envelope))
		.filter(
			(
				frame,
			): frame is Record<string, unknown> & {
				kind: 'message'
				role: 'assistant'
				content: string
				final?: boolean
			} =>
				frame !== null &&
				frame.kind === 'message' &&
				frame.role === 'assistant' &&
				typeof frame.content === 'string' &&
				frame.content.trim().length > 0,
		)
	if (assistantFrames.length === 0) {
		return ''
	}
	const streamed = assistantFrames
		.filter(frame => frame.final !== true)
		.map(frame => String(frame.content))
		.join('')
	const finalFrame = [...assistantFrames].reverse().find(frame => frame.final === true)
	if (!finalFrame) {
		return streamed.trim()
	}
	const finalText = String(finalFrame.content)
	if (!streamed) {
		return finalText.trim()
	}
	if (finalText.startsWith(streamed)) {
		return finalText.trim()
	}
	if (streamed.endsWith(finalText)) {
		return streamed.trim()
	}
	return `${streamed}${finalText}`.trim()
}

export const extractAgentErrorMessage = (envelopes: AgentProtocolEnvelope[]): string => {
	for (let index = envelopes.length - 1; index >= 0; index -= 1) {
		const frame = toFrameRecord(envelopes[index])
		if (frame?.kind === 'error') {
			return (
				(typeof frame.message === 'string' ? frame.message.trim() : '') ||
				(typeof frame.code === 'string' ? frame.code : '') ||
				'Sub-agent execution failed.'
			)
		}
	}
	return ''
}

export const extractArtifactContent = (envelopes: AgentProtocolEnvelope[], artifactId: string): string | null => {
	for (let index = envelopes.length - 1; index >= 0; index -= 1) {
		const frame = toFrameRecord(envelopes[index])
		if (frame?.kind === 'artifact' && frame.artifactId === artifactId) {
			if (typeof frame.content === 'string') {
				return frame.content
			}
			if (typeof frame.content === 'object' && frame.content !== null) {
				return JSON.stringify(frame.content)
			}
		}
	}
	return null
}

export const extractArtifactJson = <T>(envelopes: AgentProtocolEnvelope[], artifactId: string): T | null => {
	const content = extractArtifactContent(envelopes, artifactId)
	if (!content) {
		return null
	}
	try {
		return JSON.parse(content) as T
	} catch {
		return null
	}
}
