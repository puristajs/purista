import { StatusCode, UnhandledError } from '@purista/core'

type CloudEventHttpInput = {
	headers: Record<string, string>
	body: string
}

/**
 * Extracts the PURISTA message payload from a CloudEvents HTTP request.
 *
 * Supports CloudEvents 1.0 structured JSON requests and binary-mode requests
 * where the HTTP body is JSON. Batch CloudEvents are intentionally rejected
 * because PURISTA command/subscription handlers process one message per call.
 */
export const parseCloudEventData = <T>({ headers, body }: CloudEventHttpInput): T => {
	const normalizedHeaders = normalizeHeaders(headers)
	const contentType = normalizedHeaders['content-type']?.toLowerCase() ?? ''

	if (contentType.includes('application/cloudevents-batch+json')) {
		const batch = parseJson(body, 'CloudEvent batch payload must be valid JSON')
		if (Array.isArray(batch)) {
			throw new UnhandledError(StatusCode.NotImplemented, 'Support of multiple events per call is not supported')
		}
		throw new UnhandledError(StatusCode.BadRequest, 'CloudEvent batch payload must be a JSON array')
	}

	if (contentType.includes('application/cloudevents+json') || !normalizedHeaders['ce-specversion']) {
		const event = parseJson(body, 'CloudEvent payload must be valid JSON')
		if (Array.isArray(event)) {
			throw new UnhandledError(StatusCode.NotImplemented, 'Support of multiple events per call is not supported')
		}
		if (!isRecord(event) || !('data' in event)) {
			throw new UnhandledError(StatusCode.BadRequest, 'CloudEvent payload must contain a data field')
		}
		return event.data as T
	}

	return parseJson(body, 'CloudEvent binary data must be valid JSON') as T
}

function normalizeHeaders(headers: Record<string, string>): Record<string, string> {
	const normalized: Record<string, string> = {}
	for (const [key, value] of Object.entries(headers)) {
		normalized[key.toLowerCase()] = value
	}
	return normalized
}

function parseJson(body: string, message: string): unknown {
	try {
		return JSON.parse(body)
	} catch (error) {
		throw UnhandledError.fromError(error, StatusCode.BadRequest, message)
	}
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null
}
