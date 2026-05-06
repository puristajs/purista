import type { HttpExposedServiceMeta } from '@purista/core'
import { StatusCode } from '@purista/core'
import { OpenApiBuilder } from 'openapi3-ts/oas31'
import { describe, expect, it } from 'vitest'

import { addPathToOpenApi } from './addPathToOpenApi.js'
import { getErrorResponseSchema } from './getErrorResponseSchema.js'
import { getParameterDefinition } from './getParameterDefinition.js'
import { getQueryDefinition, getQueryDefintion } from './getQueryDefinition.js'

describe('openapi helpers', () => {
	it('extracts path parameter definitions including optional and referenced params', () => {
		const params = getParameterDefinition('/users/:userId/orders/:orderId?', {
			type: 'object',
			properties: {
				userId: { $ref: '#/components/schemas/UserId' },
				orderId: { type: 'string', description: 'order id' },
			},
		})

		expect(params).toEqual([
			{
				in: 'path',
				name: 'userId',
				required: true,
				$ref: '#/components/schemas/UserId',
			},
			{
				in: 'path',
				name: 'orderId',
				required: false,
				schema: { type: 'string', description: 'order id' },
				description: 'order id',
			},
		])
	})

	it('creates query definitions and keeps deprecated alias aligned', () => {
		const input = [{ name: 'search', required: true }] as const
		const schema = {
			type: 'object',
			properties: {
				search: { type: 'string', title: 'Search term' },
			},
		} as const

		expect(getQueryDefinition(undefined, schema as any)).toEqual([])
		expect(getQueryDefinition(input as any, schema as any)).toEqual([
			{
				in: 'query',
				name: 'search',
				required: true,
				schema: { type: 'string', title: 'Search term' },
				description: 'Search term',
			},
		])
		expect(getQueryDefintion(input as any, schema as any)).toEqual(getQueryDefinition(input as any, schema as any))
	})

	it('creates bad-request error schemas with validation data by default', () => {
		const schema = getErrorResponseSchema(StatusCode.BadRequest, 'Bad Request')
		expect(schema.properties?.errors).toBeDefined()
		expect(schema.required).toEqual(['type', 'title', 'status', 'detail'])
	})

	it('adds aggregate stream responses to openapi without request bodies for GET', () => {
		const builder = new OpenApiBuilder({
			openapi: '3.1.0',
			info: { title: 'test', version: '1.0.0' },
			components: { securitySchemes: { bearer: { type: 'http', scheme: 'bearer' } } },
		})
		const finalPayload = {
			type: 'object',
			properties: { message: { type: 'string' } },
		} as const

		const metadata = {
			expose: {
				contentTypeRequest: 'application/json',
				contentEncodingRequest: 'utf-8',
				contentTypeResponse: 'application/json',
				contentEncodingResponse: 'utf-8',
				parameter: {
					type: 'object',
					properties: {
						search: { type: 'string', description: 'search text' },
					},
				},
				chunkPayload: {
					type: 'object',
					properties: { partial: { type: 'string' } },
				},
				finalPayload,
				http: {
					method: 'GET',
					path: 'aggregate',
					stream: {
						mode: 'aggregate',
						protocol: 'purista',
						documentationUrl: 'https://example.com/stream-protocol',
					},
					openApi: {
						isSecure: true,
						description: 'aggregate endpoint',
						summary: 'Aggregate',
						query: [{ name: 'search', required: false }],
						additionalStatusCodes: [StatusCode.Conflict],
						operationId: 'aggregateExample',
					},
				},
			},
		} as unknown as HttpExposedServiceMeta

		addPathToOpenApi(builder, metadata, '/api/v1/aggregate', {
			traceHeaderField: 'x-trace-id',
			problemDetails: { typeBaseUri: 'https://api.example.com/problems' },
		})
		const spec = builder.getSpec()
		const endpoint = spec.paths?.['/api/v1/aggregate']?.get
		const okResponse = endpoint?.responses?.['200'] as { content?: Record<string, { schema?: unknown }> }

		expect(endpoint?.requestBody).toBeUndefined()
		expect(endpoint?.security).toEqual([{ bearer: [] }])
		expect(endpoint?.parameters?.some(param => 'name' in param && param.name === 'x-trace-id')).toBe(true)
		expect(endpoint?.responses?.['401']).toBeDefined()
		expect(endpoint?.responses?.['409']).toBeDefined()
		expect(okResponse.content?.['application/json']?.schema).toEqual(finalPayload)
		const errorResponse = endpoint?.responses?.['401'] as { content?: Record<string, { schema?: unknown }> }
		expect(errorResponse.content?.['application/problem+json']?.schema).toEqual({
			$ref: '#/components/schemas/error_401_schema',
		})
		expect(errorResponse.content?.['text/markdown']?.schema).toEqual({ type: 'string' })
		expect(spec.components?.schemas?.error_401_schema).toMatchObject({
			properties: {
				type: { example: 'https://api.example.com/problems/unauthorized' },
			},
		})
	})

	it('adds streaming SSE response schema with protocol metadata', () => {
		const builder = new OpenApiBuilder({
			openapi: '3.1.0',
			info: { title: 'test', version: '1.0.0' },
		})

		const metadata = {
			expose: {
				contentTypeRequest: 'application/json',
				contentEncodingRequest: 'utf-8',
				contentTypeResponse: 'text/event-stream',
				contentEncodingResponse: 'utf-8',
				inputPayload: {
					type: 'object',
					properties: {
						prompt: { type: 'string' },
					},
				},
				chunkPayload: {
					type: 'object',
					properties: { partial: { type: 'string' } },
				},
				finalPayload: {
					type: 'object',
					properties: { message: { type: 'string' } },
				},
				http: {
					method: 'POST',
					path: 'stream',
					stream: {
						mode: 'stream',
						protocol: 'custom-event-stream',
						documentationUrl: 'https://example.com/stream-events',
					},
					openApi: {
						isSecure: false,
						description: 'stream endpoint',
						summary: 'Stream',
					},
				},
			},
		} as unknown as HttpExposedServiceMeta

		addPathToOpenApi(builder, metadata, '/api/v1/stream', {})
		const spec = builder.getSpec()
		const endpoint = spec.paths?.['/api/v1/stream']?.post
		const okResponse = endpoint?.responses?.['200'] as {
			content?: Record<string, { schema?: Record<string, unknown>; [key: string]: unknown }>
		}

		expect(endpoint?.requestBody).toBeDefined()
		expect(okResponse.content?.['text/event-stream']?.schema).toMatchObject({
			oneOf: expect.any(Array),
		})
		expect(okResponse.content?.['text/event-stream']?.['x-purista-stream-protocol']).toBe('custom-event-stream')
		expect(okResponse.content?.['text/event-stream']?.['x-purista-stream-protocol-docs']).toBe(
			'https://example.com/stream-events',
		)
	})

	it('adds PURISTA operation extensions and 202 schema for async endpoints', () => {
		const builder = new OpenApiBuilder({
			openapi: '3.1.0',
			info: { title: 'test', version: '1.0.0' },
		})

		const metadata = {
			expose: {
				contentTypeRequest: 'application/json',
				contentEncodingRequest: 'utf-8',
				contentTypeResponse: 'application/json',
				contentEncodingResponse: 'utf-8',
				inputPayload: {
					type: 'object',
					properties: { prompt: { type: 'string' } },
				},
				outputPayload: {
					type: 'object',
					properties: { priority: { type: 'string' } },
				},
				http: {
					method: 'POST',
					path: 'agents/triage',
					mode: 'async',
					openApi: {
						isSecure: true,
						description: 'async agent endpoint',
						summary: 'Async agent',
						additionalStatusCodes: [StatusCode.Accepted],
					},
				},
			},
		} as unknown as HttpExposedServiceMeta

		addPathToOpenApi(
			builder,
			metadata,
			'/api/v1/agents/triage',
			{},
			{
				serviceName: 'support',
				serviceVersion: '1',
				serviceTarget: 'triage',
			},
		)

		const endpoint = builder.getSpec().paths?.['/api/v1/agents/triage']?.post
		const acceptedResponse = endpoint?.responses?.['202'] as {
			content?: Record<string, { schema?: { properties?: Record<string, unknown> } }>
		}

		expect(endpoint?.['x-purista-service-name']).toBe('support')
		expect(endpoint?.['x-purista-service-version']).toBe('1')
		expect(endpoint?.['x-purista-command-name']).toBe('triage')
		expect(endpoint?.['x-purista-runtime-mode']).toBe('async-job')
		expect(endpoint?.['x-purista-endpoint-security']).toBe('protected-application-middleware')
		expect(endpoint?.responses?.['202']).toBeDefined()
		expect(endpoint?.responses?.['202']).not.toHaveProperty('content.application/problem+json')
		expect(acceptedResponse.content?.['application/json']?.schema?.properties?.jobId).toBeDefined()
		expect(acceptedResponse.content?.['application/json']?.schema?.properties?.runId).toBeDefined()
	})
})
