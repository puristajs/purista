import { describe, expect, it } from 'vitest'
import { createProtocolSafeErrorDetails, createSanitizedErrorDiagnostics } from './errorDiagnostics.js'

const createProviderError = () =>
	Object.assign(new Error('Provider request failed'), {
		name: 'AI_APICallError',
		url: 'https://api.openai.com/v1/responses',
		statusCode: 503,
		code: 'rate_limit_exceeded',
		isRetryable: true,
		requestBodyValues: {
			input: [{ role: 'user', content: 'top secret prompt' }],
			messages: [{ role: 'user', content: 'top secret message' }],
			prompt: 'top secret prompt',
			attachments: [{ id: 'file-1' }],
		},
		responseHeaders: {
			'x-request-id': 'req_123',
			'content-type': 'application/json',
		},
		responseBody: JSON.stringify({
			error: {
				message: 'Upstream overloaded',
				type: 'server_error',
			},
		}),
	})

describe('error diagnostics', () => {
	it('sanitizes provider errors without leaking request bodies', () => {
		const diagnostics = createSanitizedErrorDiagnostics(createProviderError(), { fallbackKind: 'provider' })
		const serialized = JSON.stringify(diagnostics)

		expect(diagnostics.kind).toBe('provider')
		expect(diagnostics.statusCode).toBe(503)
		expect(diagnostics.providerCode).toBe('rate_limit_exceeded')
		expect(diagnostics.requestId).toBe('req_123')
		expect(diagnostics.responseBody).toEqual({
			error: {
				message: 'Upstream overloaded',
				type: 'server_error',
			},
		})
		expect(serialized).not.toContain('requestBodyValues')
		expect(serialized).not.toContain('top secret prompt')
		expect(serialized).not.toContain('top secret message')
	})

	it('summarizes retry failures without leaking nested request payloads', () => {
		const diagnostics = createSanitizedErrorDiagnostics({
			name: 'AI_RetryError',
			message: 'Failed after 3 attempts',
			reason: 'maxRetriesExceeded',
			errors: [createProviderError(), createProviderError(), createProviderError()],
			lastError: createProviderError(),
		})
		const serialized = JSON.stringify(diagnostics)

		expect(diagnostics.attempts).toBe(3)
		expect(diagnostics.retryable).toBe(true)
		expect(diagnostics.reason).toBe('maxRetriesExceeded')
		expect(serialized).not.toContain('requestBodyValues')
		expect(serialized).not.toContain('top secret prompt')
	})

	it('emits protocol-safe details only', () => {
		const details = createProtocolSafeErrorDetails(createProviderError(), { provider: 'openai' })
		expect(details).toEqual({
			kind: 'provider',
			statusCode: 503,
			provider: 'openai',
			providerCode: 'rate_limit_exceeded',
			requestId: 'req_123',
			retryable: true,
			attempts: undefined,
			reason: undefined,
		})
	})
})
