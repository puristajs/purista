import { HandledError, StatusCode, UnhandledError } from '@purista/core/adapter'
import { describe, expect, it } from 'vitest'

import {
	getProblemDetailsSchema,
	getProblemTypeUri,
	negotiateProblemRepresentation,
	renderProblemDetailsMarkdown,
	toProblemDetails,
} from './problemDetails.js'

describe('problemDetails helpers', () => {
	it('maps validation handled errors to RFC 9457 problem details', () => {
		const error = new HandledError(StatusCode.BadRequest, 'Input validation failed', [
			{ code: 'too_small', message: 'too short', path: ['username'] },
		])

		const result = toProblemDetails(error, { traceId: 'trace-1', instance: '/api/v1/users' })

		expect(result).toEqual({
			type: 'about:blank',
			title: 'Bad Request',
			status: 400,
			detail: 'Input validation failed',
			instance: '/api/v1/users',
			traceId: 'trace-1',
			errors: [{ code: 'too_small', message: 'too short', path: ['username'] }],
		})
	})

	it('hides unsafe unhandled 5xx detail but keeps trace id', () => {
		const error = new UnhandledError(StatusCode.InternalServerError, 'database exploded', { debug: true }, 'trace-2')

		const result = toProblemDetails(error, { instance: '/api/v1/users' })

		expect(result).toEqual({
			type: 'about:blank',
			title: 'Internal Server Error',
			status: 500,
			detail: 'Internal Server Error',
			instance: '/api/v1/users',
			traceId: 'trace-2',
		})
	})

	it('renders markdown representation from normalized problem details', () => {
		const markdown = renderProblemDetailsMarkdown({
			type: 'about:blank',
			title: 'Not Found',
			status: 404,
			detail: 'Route not found',
			traceId: 'trace-3',
			details: { method: 'GET' },
		})

		expect(markdown).toContain('# Not Found')
		expect(markdown).toContain('Route not found')
		expect(markdown).toContain('## Details')
		expect(markdown).toContain('trace-3')
	})

	it('negotiates markdown only when explicitly preferred', () => {
		expect(negotiateProblemRepresentation(undefined)).toBe('json')
		expect(negotiateProblemRepresentation('application/problem+json')).toBe('json')
		expect(negotiateProblemRepresentation('text/markdown')).toBe('markdown')
		expect(negotiateProblemRepresentation('text/markdown;q=0.9, application/problem+json;q=0.5')).toBe('markdown')
		expect(negotiateProblemRepresentation('application/json, */*')).toBe('json')
	})

	it('creates RFC 9457 schema and problem type URIs', () => {
		const schema = getProblemDetailsSchema(StatusCode.NotFound, 'Route not found')
		expect(schema.required).toEqual(['type', 'title', 'status', 'detail'])
		expect(getProblemTypeUri(StatusCode.NotFound)).toBe('about:blank')
		expect(getProblemTypeUri(StatusCode.BadRequest, [{ code: 'invalid', message: 'broken' }])).toBe('about:blank')
		expect(getProblemTypeUri(StatusCode.NotFound, undefined, { typeBaseUri: 'https://api.example.com/problems' })).toBe(
			'https://api.example.com/problems/not-found',
		)
		expect(
			getProblemTypeUri(StatusCode.BadRequest, [{ code: 'invalid', message: 'broken' }], {
				typeBaseUri: 'https://api.example.com/problems/',
			}),
		).toBe('https://api.example.com/problems/validation-error')
	})

	it('passes through existing problem details and maps handled details payloads', () => {
		expect(
			toProblemDetails(
				{
					type: 'https://example.com/problem',
					title: 'Example',
					status: 422,
					detail: 'already normalized',
				},
				{ traceId: 'trace-pass', instance: '/already' },
			),
		).toEqual({
			type: 'https://example.com/problem',
			title: 'Example',
			status: 422,
			detail: 'already normalized',
			traceId: 'trace-pass',
			instance: '/already',
		})

		const handled = new HandledError(StatusCode.Conflict, 'duplicate', { id: '123' }, 'trace-handled')
		expect(toProblemDetails(handled, { instance: '/resource' })).toEqual({
			type: 'about:blank',
			title: 'Conflict',
			status: 409,
			detail: 'duplicate',
			instance: '/resource',
			traceId: 'trace-handled',
			details: { id: '123' },
		})
	})

	it('covers record and explicit-details branches', () => {
		expect(
			toProblemDetails(new UnhandledError(StatusCode.BadGateway, 'gateway broke', { upstream: true }, 'trace-up'), {
				instance: '/upstream',
				safeInternalDetails: true,
			}),
		).toEqual({
			type: 'about:blank',
			title: 'Bad Gateway',
			status: 502,
			detail: 'Bad Gateway',
			instance: '/upstream',
			traceId: 'trace-up',
			details: { upstream: true },
		})

		expect(
			toProblemDetails({ status: 400, data: { field: 'name' }, traceId: 'trace-obj' }, { instance: '/object-error' }),
		).toEqual({
			type: 'about:blank',
			title: 'Bad Request',
			status: 400,
			detail: 'Bad Request',
			instance: '/object-error',
			traceId: 'trace-obj',
			details: { field: 'name' },
		})

		expect(toProblemDetails('oops', { statusCode: StatusCode.BadRequest })).toEqual({
			type: 'about:blank',
			title: 'Bad Request',
			status: 400,
			detail: 'oops',
			instance: undefined,
			traceId: undefined,
		})
	})

	it('uses configured problem type base URI in normalized problem details and schemas', () => {
		const handled = new HandledError(StatusCode.NotFound, 'missing')
		expect(
			toProblemDetails(handled, {
				instance: '/resource',
				problemTypeConfig: { typeBaseUri: 'https://api.example.com/problems' },
			}),
		).toEqual({
			type: 'https://api.example.com/problems/not-found',
			title: 'Not Found',
			status: 404,
			detail: 'missing',
			instance: '/resource',
			traceId: undefined,
		})

		const schema = getProblemDetailsSchema(StatusCode.NotFound, 'Route not found', undefined, {
			typeBaseUri: 'https://api.example.com/problems',
		})
		expect(schema.properties?.type).toMatchObject({
			example: 'https://api.example.com/problems/not-found',
		})
	})

	it('covers additional accept negotiation branches and details schema generation', () => {
		expect(negotiateProblemRepresentation('text/*')).toBe('markdown')
		expect(negotiateProblemRepresentation('application/*')).toBe('json')
		expect(negotiateProblemRepresentation('image/png')).toBe('json')

		const schema = getProblemDetailsSchema(StatusCode.Conflict, 'duplicate', {
			type: 'object',
			properties: { id: { type: 'string' } },
		})
		expect(schema.properties?.details).toEqual({
			type: 'object',
			properties: { id: { type: 'string' } },
		})
	})
})
