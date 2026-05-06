import { createSandbox } from 'sinon'
import { z } from 'zod'
import { EBMessageType, Service } from '../core/index.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import { getEventBridgeMock, getLoggerMock } from '../mocks/index.js'
import { StreamDefinitionBuilder } from './StreamDefinitionBuilder.impl.js'

describe('StreamDefinitionBuilder', () => {
	const sandbox = createSandbox()

	const service = new Service({
		info: {
			serviceName: 'TestService',
			serviceVersion: '1',
			serviceDescription: 'A service',
		},
		commandDefinitionList: [],
		subscriptionDefinitionList: [],
		streamDefinitionList: [],
		logger: getLoggerMock(sandbox).mock,
		eventBridge: getEventBridgeMock(sandbox).mock,
		config: {},
	})

	afterAll(() => {
		sandbox.restore()
	})

	it('provides default aggregated final schema when enabled and no final schema was set', async () => {
		const builder = new StreamDefinitionBuilder('searchUsers', 'stream users')
			.addPayloadSchema(z.object({ search: z.string() }))
			.addParameterSchema(z.object({ page: z.number().default(1) }))
			.addChunkSchema(z.object({ id: z.string() }))
			.enableChunkAggregation(true)
			.setStreamFunction(async function (_context, _payload, _parameter, writer) {
				await writer.write({ id: 'u1' })
				await writer.close()
			})

		const streamFunction = builder.getStreamFunction()
		expect(streamFunction).toBeTypeOf('function')

		const definition = await builder.getDefinition()
		expect(definition.streamName).toBe('searchUsers')
		expect(definition.finalSchema).toBeUndefined()
		expect(definition.metadata.expose.finalPayload).toMatchObject({
			type: 'object',
			properties: {
				chunkCount: { type: 'number' },
				chunks: {
					type: 'array',
				},
			},
			required: ['chunkCount', 'chunks'],
		})
	})

	it('uses explicit final schema and event name when configured', async () => {
		const builder = new StreamDefinitionBuilder('searchUsers', 'stream users')
			.addPayloadSchema(z.object({ search: z.string() }))
			.addParameterSchema(z.object({ page: z.number().default(1) }))
			.addChunkSchema(z.object({ id: z.string() }))
			.addFinalSchema(z.object({ ids: z.array(z.string()) }))
			.setFinalEventName('user.search.completed')
			.enableChunkAggregation(false)
			.setStreamFunction(async function (_context, _payload, _parameter, writer) {
				await writer.close({ ids: ['u1'] })
			})

		const definition = await builder.getDefinition()
		expect(definition.finalEventName).toBe('user.search.completed')
		expect(definition.aggregateChunks).toBe(false)
		expect(definition.metadata.expose.finalPayload).toMatchObject({
			type: 'object',
			properties: {
				ids: {
					type: 'array',
				},
			},
		})
	})

	it('can execute stream function against a concrete service instance', async () => {
		const builder = new StreamDefinitionBuilder('searchUsers', 'stream users').setStreamFunction(
			async function (_context, _payload, _parameter, writer) {
				await writer.close()
			},
		)
		const fn = builder.getStreamFunction().bind(service)

		await expect(
			fn(
				{
					message: {} as never,
					service: {},
					stream: {},
					emit: async () => undefined,
					resources: {},
				} as never,
				{},
				{},
				{
					cancelled: false,
					write: async () => undefined,
					close: async () => undefined,
					fail: async () => undefined,
					onCancel: () => undefined,
				},
			),
		).resolves.toBeUndefined()
	})

	it('adds http/openapi metadata and invoke declarations to stream definition', async () => {
		const builder = new StreamDefinitionBuilder('searchUsers', 'stream users')
			.addPayloadSchema(z.object({ search: z.string() }), 'application/json', 'utf-8')
			.addParameterSchema(z.object({ page: z.number() }))
			.addChunkSchema(z.object({ id: z.string() }), false)
			.addFinalSchema(z.object({ ids: z.array(z.string()) }), false)
			.canInvoke(
				'AuditService',
				'1',
				'writeAudit',
				z.object({ ok: z.boolean() }),
				z.object({ id: z.string() }),
				z.object({}),
			)
			.canConsumeStream(
				'SearchService',
				'1',
				'searchUsers',
				z.object({ id: z.string() }),
				z.object({ q: z.string() }),
				z.object({ page: z.number() }),
				z.object({ ids: z.array(z.string()) }),
			)
			.canEmit('user.search.completed', z.object({ ids: z.array(z.string()) }))
			.exposeAsHttpStreamEndpoint('POST', '/search-users')
			.makeEndpointPublic()
			.enableHttpSecurity(false)
			.setOpenApiSummary('Search users stream')
			.setOpenApiOperationId('searchUsersStream')
			.addOpenApiTags('search', 'users')
			.addOpenApiErrorStatusCodes(StatusCode.BadRequest, StatusCode.Unauthorized)
			.addQueryParameters({
				name: 'page',
				required: false,
			})
			.setStreamFunction(async function (_context, _payload, _parameter, writer) {
				await writer.close({ ids: [] })
			})

		const definition = await builder.getDefinition()
		expect(definition.metadata.expose.http).toMatchObject({
			method: 'POST',
			path: '/search-users',
			openApi: {
				description: 'stream users',
				summary: 'Search users stream',
				operationId: 'searchUsersStream',
				isSecure: false,
			},
		})
		expect(definition.chunkValidationEnabled).toBe(false)
		expect(definition.finalValidationEnabled).toBe(false)
		expect(definition.invokes.AuditService['1'].writeAudit).toBeDefined()
		expect(definition.streamInvokes.SearchService['1'].searchUsers).toBeDefined()
		expect(definition.emitList['user.search.completed']).toBeDefined()
	})

	it('throws when stream function is missing', () => {
		const builder = new StreamDefinitionBuilder('searchUsers', 'stream users')
		expect(() => builder.getStreamFunction()).toThrow('No function implementation for searchUsers')
	})

	it('supports aggregate HTTP response mode for streams', async () => {
		const definition = await new StreamDefinitionBuilder('aggregate', 'aggregate stream')
			.exposeAsHttpStreamEndpoint('GET', '/aggregate')
			.setHttpStreamingMode('aggregate')
			.setStreamFunction(async function (_context, _payload, _parameter, writer) {
				await writer.close({ done: true })
			})
			.getDefinition()

		expect(definition.metadata.expose.contentTypeResponse).toBe('application/json')
		expect(definition.metadata.expose.http?.stream?.mode).toBe('aggregate')
	})

	it('stores and exposes stream guard hooks by name', () => {
		const beforeGuard = vi.fn(async function beforeGuard() {})
		const afterGuard = vi.fn(async function afterGuard() {})

		const builder = new StreamDefinitionBuilder('guardedStream', 'guarded stream')
			.setBeforeGuardHooks({ auth: beforeGuard })
			.setAfterGuardHooks({ audit: afterGuard })

		expect(builder.getBeforeGuardHook('auth')).toBe(beforeGuard)
		expect(builder.getAfterGuardHook('audit')).toBe(afterGuard)
	})

	it('executes stream before and after guard hooks during runtime', async () => {
		const events: string[] = []
		const builder = new StreamDefinitionBuilder('guardedRuntime', 'guarded runtime stream')
			.addPayloadSchema(z.object({ prompt: z.string() }))
			.addFinalSchema(z.object({ answer: z.string() }))
			.setBeforeGuardHooks({
				auth: async function (_context, payload) {
					events.push(`before:${payload.prompt}`)
				},
			})
			.setAfterGuardHooks({
				audit: async function (_context, result) {
					events.push(`after:${String(result?.answer ?? '')}`)
				},
			})
			.setStreamFunction(async function (_context, payload, _parameter, writer) {
				events.push(`handler:${payload.prompt}`)
				await writer.close({ answer: 'ok' })
			})

		const definition = await builder.getDefinition()
		await service.registerStream(definition)
		await service.executeStream({
			id: 'stream-open-1',
			correlationId: 'corr-1',
			timestamp: Date.now(),
			traceId: 'trace-1',
			messageType: EBMessageType.Stream,
			contentType: 'application/json',
			contentEncoding: 'utf-8',
			principalId: 'principal',
			tenantId: 'tenant',
			sender: {
				serviceName: 'Client',
				serviceVersion: '1',
				serviceTarget: 'open',
				instanceId: 'client-1',
			},
			receiver: {
				serviceName: 'TestService',
				serviceVersion: '1',
				serviceTarget: 'guardedRuntime',
				instanceId: 'instance-1',
			},
			payload: {
				frameType: 'open',
				payload: { prompt: 'hello' },
				parameter: {},
			},
		} as never)

		expect(events).toEqual(['before:hello', 'handler:hello', 'after:ok'])
	})
})
