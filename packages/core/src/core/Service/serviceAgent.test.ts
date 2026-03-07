import { createSandbox } from 'sinon'
import { z } from 'zod/v4'
import { CommandDefinitionBuilder } from '../../CommandDefinitionBuilder/CommandDefinitionBuilder.impl.js'
import { getEventBridgeMock, getLoggerMock } from '../../mocks/index.js'
import { EBMessageType } from '../types/index.js'
import type { StreamHandle } from '../types/stream/StreamHandle.js'
import { Service } from './Service.impl.js'

describe('Service Agent Integration', () => {
	const sandbox = createSandbox()
	const loggerMock = getLoggerMock(sandbox)
	const eventBridgeMock = getEventBridgeMock(sandbox)

	beforeEach(() => {
		eventBridgeMock.stubs.isReady.resolves(true)
		eventBridgeMock.stubs.isHealthy.resolves(true)
	})

	afterEach(() => {
		sandbox.reset()
	})

	it('successfully invokes an agent through the context proxy', async () => {
		const agentResponse = [{ message: 'Hello from agent' }]
		const streamHandle = {
			sessionId: 'agent-stream-1',
			cancel: sandbox.stub().resolves(),
			async *[Symbol.asyncIterator]() {
				yield {
					messageType: EBMessageType.Stream,
					id: 'frame-1',
					timestamp: Date.now(),
					correlationId: 'corr-id',
					traceId: 'trace-id',
					contentType: 'application/json',
					contentEncoding: 'utf-8',
					sender: {
						serviceName: 'MyAgent',
						serviceVersion: '1',
						serviceTarget: 'run',
						instanceId: 'agent-inst',
					},
					receiver: {
						serviceName: 'TestService',
						serviceVersion: '1',
						serviceTarget: 'testCommand',
						instanceId: 'inst',
					},
					payload: {
						frameType: 'chunk',
						sequence: 1,
						chunk: agentResponse[0],
					},
				}
				yield {
					messageType: EBMessageType.Stream,
					id: 'frame-2',
					timestamp: Date.now(),
					correlationId: 'corr-id',
					traceId: 'trace-id',
					contentType: 'application/json',
					contentEncoding: 'utf-8',
					sender: {
						serviceName: 'MyAgent',
						serviceVersion: '1',
						serviceTarget: 'run',
						instanceId: 'agent-inst',
					},
					receiver: {
						serviceName: 'TestService',
						serviceVersion: '1',
						serviceTarget: 'testCommand',
						instanceId: 'inst',
					},
					payload: {
						frameType: 'complete',
						sequence: 2,
						final: agentResponse,
					},
				}
			},
		} as StreamHandle

		eventBridgeMock.stubs.openStream.resolves(streamHandle)

		const commandBuilder = new CommandDefinitionBuilder('testCommand', 'desc')
			.canInvokeAgent('MyAgent', '1')
			.setCommandFunction(async function (context) {
				const result = await context.invokeAgent.MyAgent['1']
					.call({ message: 'hi', history: [], attachments: [] }, {})
					.final()
				return result
			})

		const service = new Service({
			info: {
				serviceName: 'TestService',
				serviceVersion: '1',
				serviceDescription: 'desc',
			},
			commandDefinitionList: [await commandBuilder.getDefinition()] as any,
			subscriptionDefinitionList: [],
			logger: loggerMock.mock,
			eventBridge: eventBridgeMock.mock,
			config: {},
		})

		await service.start()

		const commandMsg = {
			id: 'msg-id',
			timestamp: Date.now(),
			correlationId: 'corr-id',
			traceId: 'trace-id',
			messageType: EBMessageType.Command as const,
			contentType: 'application/json',
			contentEncoding: 'utf-8',
			sender: {
				serviceName: 'External',
				serviceVersion: '1',
				serviceTarget: 'caller',
				instanceId: 'inst',
			},
			receiver: {
				serviceName: 'TestService',
				serviceVersion: '1',
				serviceTarget: 'testCommand',
			},
			payload: {
				payload: {},
				parameter: {},
			},
		}

		const result = await service.executeCommand(commandMsg)

		expect(result).toBeDefined()
		expect(result?.payload).toEqual(agentResponse)

		expect(eventBridgeMock.stubs.openStream.calledOnce).toBe(true)
		const call = eventBridgeMock.stubs.openStream.firstCall
		const invokedMsg = call.args[0]

		expect(invokedMsg.receiver.serviceName).toBe('MyAgent')
		expect(invokedMsg.receiver.serviceVersion).toBe('1')
		expect(invokedMsg.receiver.serviceTarget).toBe('run')
		expect(invokedMsg.payload.payload.message).toBe('hi')
	})

	it('validates payload against canInvokeAgent payload schema', async () => {
		eventBridgeMock.stubs.isReady.resolves(true)
		eventBridgeMock.stubs.isHealthy.resolves(true)

		const commandBuilder = new CommandDefinitionBuilder('testCommand', 'desc')
			.canInvokeAgent('MyAgent', '1', {
				payloadSchema: z.object({ message: z.string().min(1), topic: z.string() }),
				parameterSchema: z.object({ locale: z.string().optional() }),
			})
			.setCommandFunction(async function (context) {
				// missing required `topic` should fail before eventBridge.invoke
				return await context.invokeAgent.MyAgent['1']
					.call({ message: 'hi' } as unknown as { message: string; topic: string }, {})
					.final()
			})

		const service = new Service({
			info: {
				serviceName: 'TestService',
				serviceVersion: '1',
				serviceDescription: 'desc',
			},
			commandDefinitionList: [await commandBuilder.getDefinition()] as any,
			subscriptionDefinitionList: [],
			logger: loggerMock.mock,
			eventBridge: eventBridgeMock.mock,
			config: {},
		})

		await service.start()

		const commandMsg = {
			id: 'msg-id-2',
			timestamp: Date.now(),
			correlationId: 'corr-id-2',
			traceId: 'trace-id-2',
			messageType: EBMessageType.Command as const,
			contentType: 'application/json',
			contentEncoding: 'utf-8',
			sender: {
				serviceName: 'External',
				serviceVersion: '1',
				serviceTarget: 'caller',
				instanceId: 'inst',
			},
			receiver: {
				serviceName: 'TestService',
				serviceVersion: '1',
				serviceTarget: 'testCommand',
			},
			payload: {
				payload: {},
				parameter: {},
			},
		}

		const result = await service.executeCommand(commandMsg)
		expect(result?.messageType).toBe('commandErrorResponse')
		expect(eventBridgeMock.stubs.invoke.called).toBe(false)
		expect(eventBridgeMock.stubs.openStream.called).toBe(false)
	})

	it('streams agent chunks through async iterator and keeps .final as collector', async () => {
		const streamed = [{ frame: 'first' }, { frame: 'second' }]

		const streamHandle = {
			sessionId: 'agent-stream-2',
			cancel: sandbox.stub().resolves(),
			async *[Symbol.asyncIterator]() {
				yield {
					messageType: EBMessageType.Stream,
					id: 'frame-1',
					timestamp: Date.now(),
					correlationId: 'corr-id',
					traceId: 'trace-id',
					contentType: 'application/json',
					contentEncoding: 'utf-8',
					sender: {
						serviceName: 'MyAgent',
						serviceVersion: '1',
						serviceTarget: 'run',
						instanceId: 'agent-inst',
					},
					receiver: {
						serviceName: 'TestService',
						serviceVersion: '1',
						serviceTarget: 'testCommand',
						instanceId: 'inst',
					},
					payload: {
						frameType: 'chunk',
						sequence: 1,
						chunk: streamed[0],
					},
				}
				yield {
					messageType: EBMessageType.Stream,
					id: 'frame-2',
					timestamp: Date.now(),
					correlationId: 'corr-id',
					traceId: 'trace-id',
					contentType: 'application/json',
					contentEncoding: 'utf-8',
					sender: {
						serviceName: 'MyAgent',
						serviceVersion: '1',
						serviceTarget: 'run',
						instanceId: 'agent-inst',
					},
					receiver: {
						serviceName: 'TestService',
						serviceVersion: '1',
						serviceTarget: 'testCommand',
						instanceId: 'inst',
					},
					payload: {
						frameType: 'chunk',
						sequence: 2,
						chunk: streamed[1],
					},
				}
				yield {
					messageType: EBMessageType.Stream,
					id: 'frame-3',
					timestamp: Date.now(),
					correlationId: 'corr-id',
					traceId: 'trace-id',
					contentType: 'application/json',
					contentEncoding: 'utf-8',
					sender: {
						serviceName: 'MyAgent',
						serviceVersion: '1',
						serviceTarget: 'run',
						instanceId: 'agent-inst',
					},
					receiver: {
						serviceName: 'TestService',
						serviceVersion: '1',
						serviceTarget: 'testCommand',
						instanceId: 'inst',
					},
					payload: {
						frameType: 'complete',
						sequence: 3,
						final: streamed,
					},
				}
			},
		} as StreamHandle

		eventBridgeMock.stubs.openStream.resolves(streamHandle)

		const commandBuilder = new CommandDefinitionBuilder('testCommand', 'desc')
			.canInvokeAgent('MyAgent', '1')
			.setCommandFunction(async function (context) {
				const invocation = context.invokeAgent.MyAgent['1'].call({ message: 'hi' }, {})
				const chunks: unknown[] = []
				for await (const chunk of invocation) {
					chunks.push(chunk)
				}
				const final = await invocation.final()
				return { chunks, final }
			})

		const service = new Service({
			info: {
				serviceName: 'TestService',
				serviceVersion: '1',
				serviceDescription: 'desc',
			},
			commandDefinitionList: [await commandBuilder.getDefinition()] as any,
			subscriptionDefinitionList: [],
			logger: loggerMock.mock,
			eventBridge: eventBridgeMock.mock,
			config: {},
		})

		await service.start()

		const commandMsg = {
			id: 'msg-id-3',
			timestamp: Date.now(),
			correlationId: 'corr-id',
			traceId: 'trace-id',
			messageType: EBMessageType.Command as const,
			contentType: 'application/json',
			contentEncoding: 'utf-8',
			sender: {
				serviceName: 'External',
				serviceVersion: '1',
				serviceTarget: 'caller',
				instanceId: 'inst',
			},
			receiver: {
				serviceName: 'TestService',
				serviceVersion: '1',
				serviceTarget: 'testCommand',
			},
			payload: {
				payload: {},
				parameter: {},
			},
		}

		const result = await service.executeCommand(commandMsg)
		expect(result?.payload).toEqual({ chunks: streamed, final: streamed })
		expect(eventBridgeMock.stubs.openStream.calledOnce).toBe(true)
		expect(eventBridgeMock.stubs.invoke.called).toBe(false)
	})

	it('does not emit unhandledRejection when agent invoke validation fails via async iterator', async () => {
		const unhandledErrors: unknown[] = []
		const onUnhandledRejection = (error: unknown) => {
			unhandledErrors.push(error)
		}
		process.on('unhandledRejection', onUnhandledRejection)

		try {
			const commandBuilder = new CommandDefinitionBuilder('testCommand', 'desc')
				.canInvokeAgent('MyAgent', '1', {
					payloadSchema: z.object({ message: z.string(), topic: z.string() }),
				})
				.setCommandFunction(async function (context) {
					const invocation = context.invokeAgent.MyAgent['1'].call(
						{ message: 'hi' } as unknown as { message: string; topic: string },
						{},
					)

					try {
						for await (const _chunk of invocation) {
							// consume iterator
						}
						return { ok: true }
					} catch (error) {
						return {
							ok: false,
							error: error instanceof Error ? error.message : String(error),
						}
					}
				})

			const service = new Service({
				info: {
					serviceName: 'TestService',
					serviceVersion: '1',
					serviceDescription: 'desc',
				},
				commandDefinitionList: [await commandBuilder.getDefinition()] as any,
				subscriptionDefinitionList: [],
				logger: loggerMock.mock,
				eventBridge: eventBridgeMock.mock,
				config: {},
			})

			await service.start()

			const commandMsg = {
				id: 'msg-id-4',
				timestamp: Date.now(),
				correlationId: 'corr-id-4',
				traceId: 'trace-id-4',
				messageType: EBMessageType.Command as const,
				contentType: 'application/json',
				contentEncoding: 'utf-8',
				sender: {
					serviceName: 'External',
					serviceVersion: '1',
					serviceTarget: 'caller',
					instanceId: 'inst',
				},
				receiver: {
					serviceName: 'TestService',
					serviceVersion: '1',
					serviceTarget: 'testCommand',
				},
				payload: {
					payload: {},
					parameter: {},
				},
			}

			const result = await service.executeCommand(commandMsg)
			expect(result?.payload).toMatchObject({
				ok: false,
				error: expect.stringContaining('agent invoke payload schema validation failed'),
			})
			expect(eventBridgeMock.stubs.openStream.called).toBe(false)

			// Allow queued microtasks to settle before checking process-level unhandled rejections.
			await new Promise(resolve => setTimeout(resolve, 0))
			expect(unhandledErrors).toHaveLength(0)
		} finally {
			process.off('unhandledRejection', onUnhandledRejection)
		}
	})
})
