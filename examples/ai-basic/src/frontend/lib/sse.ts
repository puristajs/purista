import type { StreamFrameEvent, StreamPayload } from './types'

const DATA_PREFIX = 'data:'
const EVENT_PREFIX = 'event:'

const parseJson = (value: string): StreamFrameEvent | undefined => {
	try {
		return JSON.parse(value) as StreamFrameEvent
	} catch {
		return undefined
	}
}

export const parseSseChunk = (block: string): StreamPayload => {
	let event = 'message'
	let data = ''
	for (const line of block.split('\n')) {
		if (line.startsWith(':')) {
			continue
		}
		if (line.startsWith(EVENT_PREFIX)) {
			event = line.slice(EVENT_PREFIX.length).trim()
		}
		if (line.startsWith(DATA_PREFIX)) {
			data += line.slice(DATA_PREFIX.length).trim()
		}
	}
	return {
		event,
		raw: data,
		parsed: data.length > 0 ? parseJson(data) : undefined,
	}
}

export const readSseStream = async (
	response: Response,
	onPayload: (payload: StreamPayload) => void,
): Promise<void> => {
	if (!response.body) {
		throw new Error('No response stream body available')
	}
	const reader = response.body.getReader()
	const decoder = new TextDecoder()
	let buffer = ''
	while (true) {
		const { done, value } = await reader.read()
		if (done) {
			break
		}
		buffer += decoder.decode(value, { stream: true })
		const parts = buffer.split('\n\n')
		buffer = parts.pop() ?? ''
		for (const part of parts) {
			if (!part.trim()) {
				continue
			}
			onPayload(parseSseChunk(part))
		}
	}
	if (buffer.trim()) {
		onPayload(parseSseChunk(buffer))
	}
}
