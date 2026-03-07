import {
	type AgentProtocolEnvelope,
	agentProtocolEnvelopeSchema,
	toAgent2AgentReferenceMessage,
	toMcpReferenceToolResult,
} from '@purista/ai'

export type ParsedSseEvent = {
	event: string
	data: string
}

export type ProtocolConsumerState = {
	buffer: string
	envelopes: AgentProtocolEnvelope[]
}

export const createProtocolConsumerState = (): ProtocolConsumerState => ({
	buffer: '',
	envelopes: [],
})

const parseSseEventBlock = (block: string): ParsedSseEvent | undefined => {
	let eventName = 'message'
	const dataLines: string[] = []

	for (const line of block.split('\n')) {
		if (line.startsWith('event:')) {
			eventName = line.slice(6).trim()
			continue
		}
		if (line.startsWith('data:')) {
			dataLines.push(line.slice(5).trim())
		}
	}

	if (dataLines.length === 0) {
		return undefined
	}

	return {
		event: eventName,
		data: dataLines.join(''),
	}
}

/**
 * Parses raw SSE text into complete SSE events and returns the remaining tail buffer.
 */
export const parseSseChunk = (
	buffer: string,
	chunk: string,
): {
	events: ParsedSseEvent[]
	rest: string
} => {
	const merged = buffer + chunk
	const blocks = merged.split('\n\n')
	const rest = blocks.pop() ?? ''
	const events = blocks.map(parseSseEventBlock).filter((value): value is ParsedSseEvent => Boolean(value))
	return { events, rest }
}

const parseEnvelopeArray = (jsonText: string): AgentProtocolEnvelope[] => {
	const parsed = JSON.parse(jsonText)
	return agentProtocolEnvelopeSchema.array().parse(parsed)
}

/**
 * Extracts protocol envelopes from a parsed SSE event.
 * The Purista HTTP bridge sends envelope arrays in:
 * - `chunk` events via `{ chunk: [...] }`
 * - `complete` events via `{ final: [...] }`
 */
export const envelopesFromSseEvent = (input: ParsedSseEvent): AgentProtocolEnvelope[] => {
	const payload = JSON.parse(input.data) as { chunk?: unknown; final?: unknown }
	if (input.event === 'chunk' && payload.chunk) {
		return agentProtocolEnvelopeSchema.array().parse(payload.chunk)
	}
	if (input.event === 'complete' && payload.final) {
		return agentProtocolEnvelopeSchema.array().parse(payload.final)
	}
	return []
}

/**
 * Consumes one SSE text chunk and appends parsed envelopes to state.
 */
export const consumeProtocolSseChunk = (
	state: ProtocolConsumerState,
	chunk: string,
): {
	state: ProtocolConsumerState
	newEnvelopes: AgentProtocolEnvelope[]
} => {
	const { events, rest } = parseSseChunk(state.buffer, chunk)
	const newEnvelopes = events.flatMap(envelopesFromSseEvent)
	return {
		state: {
			buffer: rest,
			envelopes: [...state.envelopes, ...newEnvelopes],
		},
		newEnvelopes,
	}
}

/**
 * Small projection helper that frontend apps can use for chat UIs.
 */
export const toChatTranscript = (envelopes: AgentProtocolEnvelope[]): Array<{ role: string; text: string }> =>
	envelopes
		.map(envelope => envelope.frame)
		.filter(
			(frame): frame is Extract<(typeof envelopes)[number]['frame'], { kind: 'message' }> => frame.kind === 'message',
		)
		.map(frame => ({ role: frame.role, text: frame.content }))

/**
 * Reference conversion helpers for external protocol bridges.
 */
export const toReferenceInterop = (envelopes: AgentProtocolEnvelope[]) => ({
	agent2agent: envelopes.map(envelope => toAgent2AgentReferenceMessage(envelope)),
	mcpToolResult: toMcpReferenceToolResult(envelopes),
})

/**
 * Utility when you already have a raw JSON envelope array string.
 */
export const parseEnvelopeJson = (jsonText: string): AgentProtocolEnvelope[] => parseEnvelopeArray(jsonText)
