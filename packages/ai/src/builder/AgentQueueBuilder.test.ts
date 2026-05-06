import { extendApi, type QueryParameter } from '@purista/core'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { AgentQueueBuilder } from './AgentQueueBuilder.js'

const testPayloadSchema = extendApi(
	z.object({
		prompt: z.string(),
	}),
	{ title: 'TestPayload' },
)

describe('AgentQueueBuilder', () => {
	describe('constructor', () => {
		it('creates builder with required properties', () => {
			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
				description: 'Test agent description',
			})

			expect(builder).toBeDefined()
		})

		it('creates builder with minimal input', () => {
			const builder = new AgentQueueBuilder({
				agentName: 'minimalAgent',
			})

			expect(builder).toBeDefined()
		})
	})

	describe('addPayloadSchema', () => {
		it('adds payload schema', () => {
			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			}).addPayloadSchema(testPayloadSchema)

			expect(builder).toBeDefined()
		})

		it('updates builder payload type state', () => {
			const payloadSchema = extendApi(z.object({ prompt: z.string(), priority: z.number().optional() }), {
				title: 'TypedPayload',
			})
			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			}).addPayloadSchema(payloadSchema)

			type BuilderTypes = typeof builder extends AgentQueueBuilder<infer T> ? T : never
			expectTypeOf<BuilderTypes['PayloadSchema']>().toEqualTypeOf<typeof payloadSchema>()
		})
	})

	describe('addParameterSchema', () => {
		it('adds parameter schema', () => {
			const paramSchema = extendApi(z.object({ sessionId: z.string() }), { title: 'Params' })
			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			}).addParameterSchema(paramSchema)

			expect(builder).toBeDefined()
		})

		it('updates builder parameter type state', () => {
			const parameterSchema = extendApi(z.object({ sessionId: z.string(), locale: z.string().optional() }), {
				title: 'TypedParams',
			})
			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			}).addParameterSchema(parameterSchema)

			type BuilderTypes = typeof builder extends AgentQueueBuilder<infer T> ? T : never
			expectTypeOf<BuilderTypes['ParameterSchema']>().toEqualTypeOf<typeof parameterSchema>()
		})
	})

	describe('builder type progression', () => {
		it('preserves type progression across chained builder calls', () => {
			const payloadSchema = extendApi(z.object({ question: z.string() }), { title: 'QuestionPayload' })
			const parameterSchema = extendApi(z.object({ locale: z.string().optional() }), { title: 'QuestionParameter' })
			const outputSchema = extendApi(z.object({ answer: z.string() }), { title: 'QuestionOutput' })

			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			})
				.addPayloadSchema(payloadSchema)
				.addParameterSchema(parameterSchema)
				.addOutputSchema(outputSchema)

			type BuilderTypes = typeof builder extends AgentQueueBuilder<infer T> ? T : never
			expectTypeOf<BuilderTypes['PayloadSchema']>().toEqualTypeOf<typeof payloadSchema>()
			expectTypeOf<BuilderTypes['ParameterSchema']>().toEqualTypeOf<typeof parameterSchema>()
			expectTypeOf<BuilderTypes['OutputSchema']>().toEqualTypeOf<typeof outputSchema>()
		})
	})

	describe('addModel', () => {
		it('adds a model configuration', () => {
			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			}).addModel('openai:gpt-4o', { capabilities: ['text', 'text-stream'] })

			expect(builder).toBeDefined()
		})

		it('allows adding multiple models', () => {
			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			})
				.addModel('openai:gpt-4o', { capabilities: ['text', 'text-stream'] })
				.addModel('openai:gpt-4o-mini', { capabilities: ['text'] })

			expect(builder).toBeDefined()
		})

		it('narrows handler model typing to declared capabilities', () => {
			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			})
				.addModel('openai:gpt-4o', { capabilities: ['text', 'object'] })
				.setAgentFunction(async function (context) {
					expectTypeOf(context.ai.models['openai:gpt-4o'].generateObject).toBeFunction()
					expectTypeOf(context.ai.models['openai:gpt-4o'].generateText).toBeFunction()
					// @ts-expect-error streamText is not declared for a text+object model
					context.ai.models['openai:gpt-4o'].streamText
					return { message: 'ok' }
				})

			expect(builder).toBeDefined()
		})
	})

	describe('setExecutionPolicy', () => {
		it('sets execution policy', () => {
			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			}).setExecutionPolicy({
				maxModelSteps: 10,
				maxAttempts: 3,
			})

			expect(builder).toBeDefined()
		})

		it('merges with default policy values', () => {
			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			}).setExecutionPolicy({
				maxModelSteps: 5,
			})

			expect(builder).toBeDefined()
		})
	})

	describe('setAgentFunction', () => {
		it('sets the agent handler function', () => {
			const handler = async function (_context: any, _payload: any) {
				return { message: 'Hello' }
			}

			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			}).setAgentFunction(handler)

			expect(builder).toBeDefined()
		})
	})

	describe('canInvoke', () => {
		it('adds tool permission', () => {
			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			}).canInvoke('support', '1', 'lookupFaq')

			expect(builder).toBeDefined()
		})

		it('adds tool permission with schemas', () => {
			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			}).canInvoke('support', '1', 'lookupFaq', undefined, testPayloadSchema)

			expect(builder).toBeDefined()
		})

		it('propagates tool invoke typing into builder state', () => {
			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			}).canInvoke('support', '1', 'lookupFaq', undefined, testPayloadSchema)

			type ToolInvokeType = (typeof builder extends AgentQueueBuilder<infer T> ? T : never)['ToolInvokes']
			type LookupType = ToolInvokeType['support']['1']['lookupFaq']

			expectTypeOf<LookupType>().toBeFunction()
		})

		it('infers context tool invoke function signature in handler', () => {
			const payloadSchema = extendApi(
				z.object({
					question: z.string(),
				}),
				{ title: 'LookupPayload' },
			)
			const parameterSchema = extendApi(
				z.object({
					locale: z.string().optional(),
				}),
				{ title: 'LookupParameter' },
			)

			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			})
				.canInvoke('support', '1', 'lookupFaq', undefined, payloadSchema, parameterSchema)
				.setAgentFunction(async function (context) {
					expectTypeOf(context.invoke.tools.invoke.support['1'].lookupFaq).toBeFunction()
					return { message: 'ok' }
				})

			expect(builder).toBeDefined()
		})
	})

	describe('canInvokeAgent', () => {
		it('adds agent permission', () => {
			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			}).canInvokeAgent('triageAgent', '1')

			expect(builder).toBeDefined()
		})

		it('adds agent permission with config', () => {
			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			}).canInvokeAgent('triageAgent', '1', {
				payloadSchema: testPayloadSchema,
			})

			expect(builder).toBeDefined()
		})

		it('infers runObject output type from declared agent schema', async () => {
			const triageOutputSchema = extendApi(
				z.object({
					answer: z.string(),
				}),
				{ title: 'TriageOutput' },
			)

			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			})
				.canInvokeAgent('triageAgent', {
					outputSchema: triageOutputSchema,
				})
				.setAgentFunction(async function (context) {
					const result = await context.invoke.agents.runObject({
						agentName: 'triageAgent',
						serviceVersion: '1',
						payload: {},
					})

					expectTypeOf(result).toMatchTypeOf<{ answer: string }>()

					return { message: 'ok' }
				})

			expect(builder).toBeDefined()
		})

		it('infers chained agent invoke call payload and output shape', () => {
			const triagePayloadSchema = extendApi(
				z.object({
					query: z.string(),
				}),
				{ title: 'TriagePayload' },
			)
			const triageOutputSchema = extendApi(
				z.object({
					decision: z.enum(['accept', 'reject']),
				}),
				{ title: 'TriageDecision' },
			)

			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			})
				.canInvokeAgent('triageAgent', {
					payloadSchema: triagePayloadSchema,
					outputSchema: triageOutputSchema,
				})
				.setAgentFunction(async function (context) {
					const invocation = context.invoke.agents.invoke.triageAgent['1'].call({ query: 'hello' })
					expectTypeOf(invocation.final).toBeFunction()
					const finalResult = await invocation.final()
					expectTypeOf(finalResult.output).toMatchTypeOf<{ decision: 'accept' | 'reject' } | undefined>()
					return { message: 'ok' }
				})

			expect(builder).toBeDefined()
		})
	})

	describe('exposeAsHttpEndpoint', () => {
		it('sets HTTP exposure', () => {
			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			}).exposeAsHttpEndpoint('POST', 'agents/testAgent')

			expect(builder).toBeDefined()
		})

		it('supports explicit stream endpoint metadata', async () => {
			const result = await new AgentQueueBuilder({
				agentName: 'testAgent',
			})
				.exposeAsHttpEndpoint('POST', 'agents/testAgent')
				.setStreamProtocolAdapter('ai-sdk.ui-message')
				.setAgentFunction(async function () {
					return { message: 'ok' }
				})
				.getDefinition()

			expect(result.manifest.httpExposure).toMatchObject({
				method: 'POST',
				path: 'agents/testAgent',
				streamingMode: 'stream',
				streamProtocolAdapter: 'ai-sdk.ui-message',
				responseContentType: 'text/event-stream',
			})
		})

		it('supports explicit aggregate endpoint metadata', async () => {
			const result = await new AgentQueueBuilder({
				agentName: 'testAgent',
			})
				.exposeAsHttpEndpoint('POST', 'agents/testAgent')
				.setStreamingMode('aggregate')
				.setAgentFunction(async function () {
					return { message: 'ok' }
				})
				.getDefinition()

			expect(result.manifest.httpExposure).toMatchObject({
				method: 'POST',
				path: 'agents/testAgent',
				streamingMode: 'aggregate',
				responseContentType: 'application/json',
			})
		})
	})

	describe('makeEndpointPublic', () => {
		it('marks the endpoint as public', () => {
			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			})
				.exposeAsHttpEndpoint('POST', 'agents/testAgent')
				.makeEndpointPublic()

			expect(builder).toBeDefined()
		})

		it('can be called before exposeAsHttpEndpoint', async () => {
			const result = await new AgentQueueBuilder({
				agentName: 'testAgent',
			})
				.makeEndpointPublic()
				.exposeAsHttpEndpoint('POST', 'agents/testAgent')
				.setAgentFunction(async function () {
					return { message: 'ok' }
				})
				.getDefinition()

			expect(result.manifest.httpExposure?.public).toBe(true)
		})
	})

	describe('addQueryParameters', () => {
		it('adds query parameters', () => {
			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			})
				.exposeAsHttpEndpoint('POST', 'agents/testAgent')
				.addParameterSchema(extendApi(z.object({ sessionId: z.string().optional() }), { title: 'SessionParams' }))
				.addQueryParameters([{ name: 'sessionId', required: false }] as QueryParameter<{ sessionId?: string }>[])

			expect(builder).toBeDefined()
		})
	})

	describe('setMaxParallelHandlers', () => {
		it('sets max parallel handlers', () => {
			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			}).setMaxParallelHandlers(4)

			expect(builder).toBeDefined()
		})
	})

	describe('guard hooks', () => {
		it('merges before guard hooks across multiple calls', () => {
			const first = async function firstGuard() {
				return
			}
			const second = async function secondGuard() {
				return
			}

			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			})
				.setBeforeGuardHooks({ first })
				.setBeforeGuardHooks({ second })

			expect(builder.getBeforeGuardHook('first')).toBe(first)
			expect(builder.getBeforeGuardHook('second')).toBe(second)
		})

		it('merges after guard hooks across multiple calls', () => {
			const first = async function firstGuard() {
				return
			}
			const second = async function secondGuard() {
				return
			}

			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			})
				.setAfterGuardHooks({ first })
				.setAfterGuardHooks({ second })

			expect(builder.getAfterGuardHook('first')).toBe(first)
			expect(builder.getAfterGuardHook('second')).toBe(second)
		})
	})

	describe('getDefinition', () => {
		it('throws error if agent function not set', async () => {
			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			})

			await expect(builder.getDefinition()).rejects.toThrow('AgentQueueBuilder: agent function not set')
		})

		it('returns queue and worker definitions when handler is set', async () => {
			const handler = async function (_context: any, _payload: any) {
				return { message: 'Hello' }
			}

			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
				description: 'Test agent',
			})
				.addPayloadSchema(testPayloadSchema)
				.addModel('openai:gpt-4o', { capabilities: ['text', 'text-stream'] })
				.setAgentFunction(handler)

			const result = await builder.getDefinition()

			expect(result.queue).toBeDefined()
			expect(result.queue.queueName).toBe('testAgent')
			expect(result.worker).toBeDefined()
			expect(result.worker.queueName).toBe('testAgent')
			expect(result.queue.workers).toHaveLength(1)
			expect(result.queue.workers[0]?.name).toBe(result.worker.name)
			expect(result.manifest).toBeDefined()
			expect(result.manifest.agentName).toBe('testAgent')
			expect(result.manifest.serviceVersion).toBe('1')
		})

		it('sets queue lifecycle config from execution policy', async () => {
			const handler = async function (_context: any, _payload: any) {
				return { message: 'Hello' }
			}

			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			})
				.setExecutionPolicy({
					leaseTtlMs: 30000,
					heartbeatIntervalMs: 10000,
					maxAttempts: 5,
				})
				.setAgentFunction(handler)

			const result = await builder.getDefinition()

			expect(result.queue.lifecycle?.visibilityTimeoutMs).toBe(30000)
			expect(result.queue.lifecycle?.heartbeatIntervalMs).toBe(10000)
			expect(result.queue.lifecycle?.maxAttempts).toBe(5)
		})

		it('creates worker with continuous mode', async () => {
			const handler = async function (_context: any, _payload: any) {
				return { message: 'Hello' }
			}

			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			}).setAgentFunction(handler)

			const result = await builder.getDefinition()

			expect(result.worker.mode).toBe('continuous')
		})

		it('sets max parallel handlers on worker', async () => {
			const handler = async function (_context: any, _payload: any) {
				return { message: 'Hello' }
			}

			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			})
				.setMaxParallelHandlers(4)
				.setAgentFunction(handler)

			const result = await builder.getDefinition()

			expect(result.worker.maxParallelHandlers).toBe(4)
		})

		it('includes model binding in manifest', async () => {
			const handler = async function (_context: any, _payload: any) {
				return { message: 'Hello' }
			}

			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			})
				.addModel('openai:gpt-4o', { capabilities: ['text', 'text-stream'] })
				.setAgentFunction(handler)

			const result = await builder.getDefinition()

			expect(result.manifest.model).toBeDefined()
			expect(result.manifest.model?.alias).toBe('openai:gpt-4o')
			expect(result.manifest.model?.capabilities).toEqual(['text', 'text-stream'])
		})

		it('defaults omitted model capabilities to the full attached-agent surface', async () => {
			const result = await new AgentQueueBuilder({
				agentName: 'testAgent',
			})
				.addModel('openai:gpt-4o')
				.setAgentFunction(async function () {
					return { message: 'ok' }
				})
				.getDefinition()

			expect(result.manifest.model?.capabilities).toEqual(['text', 'object', 'object-stream', 'text-stream'])
		})

		it('includes allowed tools in manifest', async () => {
			const handler = async function (_context: any, _payload: any) {
				return { message: 'Hello' }
			}

			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			})
				.canInvoke('support', '1', 'lookupFaq')
				.setAgentFunction(handler)

			const result = await builder.getDefinition()

			expect(result.manifest.allowedTools).toHaveLength(1)
			expect(result.manifest.allowedTools[0]).toEqual({
				serviceName: 'support',
				serviceVersion: '1',
				commandName: 'lookupFaq',
			})
		})

		it('includes HTTP exposure in manifest', async () => {
			const handler = async function (_context: any, _payload: any) {
				return { message: 'Hello' }
			}

			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
			})
				.exposeAsHttpEndpoint('POST', 'agents/testAgent')
				.setAgentFunction(handler)

			const result = await builder.getDefinition()

			expect(result.manifest.httpExposure).toBeDefined()
			expect(result.manifest.httpExposure?.method).toBe('POST')
			expect(result.manifest.httpExposure?.path).toBe('agents/testAgent')
		})

		it('stores successEventName in the manifest', async () => {
			const result = await new AgentQueueBuilder({
				agentName: 'testAgent',
				successEventName: 'support.agent.completed',
			})
				.setAgentFunction(async function () {
					return { message: 'ok' }
				})
				.getDefinition()

			expect(result.manifest.successEventName).toBe('support.agent.completed')
		})
	})

	describe('getManifest', () => {
		it('returns manifest without queue/worker definitions', async () => {
			const handler = async function (_context: any, _payload: any) {
				return { message: 'Hello' }
			}

			const builder = new AgentQueueBuilder({
				agentName: 'testAgent',
				description: 'Test agent description',
			})
				.addPayloadSchema(testPayloadSchema)
				.addModel('openai:gpt-4o', { capabilities: ['text'] })
				.setAgentFunction(handler)

			const manifest = await builder.getManifest()

			expect(manifest.agentName).toBe('testAgent')
			expect(manifest.serviceVersion).toBe('1')
			expect(manifest.description).toBe('Test agent description')
			expect(manifest.model?.alias).toBe('openai:gpt-4o')
		})
	})
})
