type CloudEventEnvelope = {
	specversion?: unknown
	data?: unknown
}

export function readCloudEventData<T>(input: { headers: Record<string, string>; body: string }): T | T[] {
	const headers = normalizeHeaders(input.headers)
	const contentType = headers['content-type'] ?? ''
	const structured = contentType.toLowerCase().includes('application/cloudevents+json')

	if (structured || looksLikeStructuredCloudEvent(input.body)) {
		const parsed = parseJson(input.body)
		if (Array.isArray(parsed)) {
			return parsed.map(event => readStructuredCloudEventData<T>(event))
		}
		return readStructuredCloudEventData<T>(parsed)
	}

	if (headers['ce-specversion']) {
		return parseJson(input.body) as T
	}

	throw new Error('Request is not a CloudEvents JSON message')
}

function readStructuredCloudEventData<T>(event: unknown): T {
	if (!isRecord(event)) {
		throw new Error('CloudEvent must be a JSON object')
	}
	const envelope = event as CloudEventEnvelope
	if (envelope.specversion !== '1.0') {
		throw new Error('Only CloudEvents specversion "1.0" is supported')
	}
	if (!('data' in event)) {
		throw new Error('CloudEvent is missing required "data" field')
	}
	return envelope.data as T
}

function normalizeHeaders(headers: Record<string, string>) {
	return Object.fromEntries(Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]))
}

function looksLikeStructuredCloudEvent(body: string) {
	const trimmed = body.trim()
	return trimmed.startsWith('{') && trimmed.includes('"specversion"') && trimmed.includes('"data"')
}

function parseJson(body: string): unknown {
	try {
		return JSON.parse(body)
	} catch (error) {
		throw new Error(`CloudEvent body must be valid JSON: ${error instanceof Error ? error.message : String(error)}`)
	}
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null
}
