import { createSandbox } from 'sinon'
import { CommandDefinitionBuilder } from '../../CommandDefinitionBuilder/CommandDefinitionBuilder.impl.js'
import { getEventBridgeMock, getLoggerMock } from '../../mocks/index.js'
import { EBMessageType } from '../types/index.js'
import { Service } from './Service.impl.js'

describe('Service Agent Integration', () => {
	const sandbox = createSandbox()
	const loggerMock = getLoggerMock(sandbox)
	const eventBridgeMock = getEventBridgeMock(sandbox)

	afterEach(() => {
		sandbox.reset()
	})

	it('successfully invokes an agent through the context proxy', async () => {
		const agentResponse = {
			message: 'Hello from agent',
			history: [],
		}

		eventBridgeMock.stubs.invoke.resolves(agentResponse)

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

		expect(eventBridgeMock.stubs.invoke.calledOnce).toBe(true)
		const call = eventBridgeMock.stubs.invoke.firstCall
		const invokedMsg = call.args[0]

		expect(invokedMsg.receiver.serviceName).toBe('MyAgent')
		expect(invokedMsg.receiver.serviceVersion).toBe('1')
		expect(invokedMsg.receiver.serviceTarget).toBe('run')
		expect(invokedMsg.payload.payload.message).toBe('hi')
	})
})
