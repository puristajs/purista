import type { AgentProtocolEnvelope } from './types.js'

export const toFrameRecord = (envelope: AgentProtocolEnvelope | undefined): Record<string, unknown> | null => {
	const frame = envelope?.frame
	if (!frame || typeof frame !== 'object') {
		return null
	}
	return frame as Record<string, unknown>
}

const isAssistantMessageFrame = (
	frame: Record<string, unknown> | null,
): frame is Record<string, unknown> & {
	kind: 'message'
	role: 'assistant'
	content?: string
	partial?: boolean
	final?: boolean
} =>
	frame !== null &&
	frame.kind === 'message' &&
	frame.role === 'assistant' &&
	(typeof frame.content === 'string' || frame.final === true)

const resolveSegmentText = (
	frames: Array<
		Record<string, unknown> & {
			content?: string
			partial?: boolean
			final?: boolean
		}
	>,
) => {
	if (frames.length === 0) {
		return ''
	}
	const finalFrame = [...frames].reverse().find(frame => frame.final === true)
	if (!finalFrame) {
		return frames
			.map(frame => String(frame.content ?? ''))
			.join('')
			.trim()
	}
	const streamed = frames
		.filter(frame => frame !== finalFrame)
		.map(frame => String(frame.content ?? ''))
		.join('')
	const finalText = String(finalFrame.content ?? '')
	if (!streamed) {
		return finalText.trim()
	}
	if (!finalText) {
		return streamed.trim()
	}
	if (finalText.startsWith(streamed)) {
		return finalText.trim()
	}
	if (streamed.endsWith(finalText)) {
		return streamed.trim()
	}
	return `${streamed}${finalText}`.trim()
}

export const extractFinalAssistantText = (envelopes: AgentProtocolEnvelope[]): string => {
	if (envelopes.length === 0) {
		return ''
	}

	let finalIndex = -1
	for (let index = envelopes.length - 1; index >= 0; index -= 1) {
		const frame = toFrameRecord(envelopes[index])
		if (isAssistantMessageFrame(frame) && frame.final === true) {
			finalIndex = index
			break
		}
	}

	if (finalIndex >= 0) {
		const segment: Array<
			Record<string, unknown> & {
				content?: string
				partial?: boolean
				final?: boolean
			}
		> = []
		for (let index = finalIndex; index >= 0; index -= 1) {
			const frame = toFrameRecord(envelopes[index])
			if (!isAssistantMessageFrame(frame)) {
				break
			}
			segment.unshift(frame)
			if (index !== finalIndex && frame.final === true) {
				segment.shift()
				break
			}
		}
		return resolveSegmentText(segment)
	}

	const trailingSegment: Array<
		Record<string, unknown> & {
			content?: string
			partial?: boolean
			final?: boolean
		}
	> = []
	for (let index = envelopes.length - 1; index >= 0; index -= 1) {
		const frame = toFrameRecord(envelopes[index])
		if (!isAssistantMessageFrame(frame)) {
			break
		}
		trailingSegment.unshift(frame)
	}
	return resolveSegmentText(trailingSegment)
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
