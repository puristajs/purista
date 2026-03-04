import { createSandbox } from 'sinon'
import { z } from 'zod'

import { Service } from '../core/index.js'
import { getEventBridgeMock, getLoggerMock } from '../mocks/index.js'
import { CommandDefinitionBuilder } from './CommandDefinitionBuilder.impl.js'

describe('CommandDefinitionBuilder Agent Integration', () => {
	const sandbox = createSandbox()
	const loggerMock = getLoggerMock(sandbox)
	const eventBridgeMock = getEventBridgeMock(sandbox)

	const _service = new Service({
		info: {
			serviceName: 'TestService',
			serviceVersion: '1',
			serviceDescription: 'A service',
		},
		commandDefinitionList: [],
		subscriptionDefinitionList: [],
		logger: loggerMock.mock,
		eventBridge: eventBridgeMock.mock,
		config: {},
	})

	afterEach(() => {
		sandbox.reset()
	})

	it('can register an agent dependency with canInvokeAgent', async () => {
		const parameterSchema = z.object({ locale: z.string() })
		const payloadSchema = z.object({ message: z.string(), locale: z.string().optional() })
		const builder = new CommandDefinitionBuilder('testCommand', 'description')
			.canInvokeAgent('MyAgent', '1', { payloadSchema, parameterSchema })
			.setCommandFunction(async function () {
				return 'ok'
			})

		const definition = await builder.getDefinition()
		expect(definition.agentInvokes).toBeDefined()
		expect(definition.agentInvokes.MyAgent).toBeDefined()
		expect(definition.agentInvokes.MyAgent['1']).toBeDefined()
		// @ts-expect-error
		expect(definition.agentInvokes.MyAgent['1'].payloadSchema).toBe(payloadSchema)
		// @ts-expect-error
		expect(definition.agentInvokes.MyAgent['1'].parameterSchema).toBe(parameterSchema)
	})

	it('exposes the agent proxy in the command context', async () => {
		const builder = new CommandDefinitionBuilder('testCommand', 'description')
			.canInvokeAgent('MyAgent', '1')
			.setCommandFunction(async function (context) {
				expect(context.invokeAgent).toBeDefined()
				expect(context.invokeAgent.MyAgent).toBeDefined()
				expect(context.invokeAgent.MyAgent['1']).toBeDefined()
				expect(typeof context.invokeAgent.MyAgent['1'].call).toBe('function')
				return 'ok'
			})

		const _definition = await builder.getDefinition()
		// We need to trigger the command to see if the proxy is there
		// Service.executeCommand usually handles this.
		// For a unit test of the builder, we can check the context mock too.

		const contextMock = builder.getCommandContextMock({
			payload: {},
			parameter: {},
			sandbox,
		})

		expect(contextMock.mock.invokeAgent).toBeDefined()
	})
})
