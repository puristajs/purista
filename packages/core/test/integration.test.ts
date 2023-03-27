import { fail } from 'assert'
import { createSandbox } from 'sinon'
import { z } from 'zod'

import { DefaultEventBridge, EBMessageType, ServiceBuilder, ServiceInfoType, StatusCode } from '../src'
import {
  getCommandContextMock,
  getCommandMessageMock,
  getCommandTransformContextMock,
  getEventBridgeMock,
  getLoggerMock,
  getSubscriptionContextMock,
  getSubscriptionTransformContextMock,
} from '../src/mocks'

describe('integration test', () => {
  const sandbox = createSandbox()

  const beforeCommandGuardHookStub = sandbox.stub()
  const afterCommandGuardHookStub = sandbox.stub()

  const beforeSubscriptionGuardHookStub = sandbox.stub()
  const afterSubscriptionGuardHookStub = sandbox.stub()

  const serviceOneInfo: ServiceInfoType = {
    serviceName: 'ServiceOne',
    serviceVersion: '1',
    serviceDescription: 'service one description',
  }

  const serviceTwoInfo: ServiceInfoType = {
    serviceName: 'ServiceTwo',
    serviceVersion: '1',
    serviceDescription: 'service two description',
  }

  let serviceOneBuilder: ServiceBuilder
  let serviceTwoBuilder: ServiceBuilder

  const commandOnePayloadSchema = z.object({
    input: z.string(),
  })
  const commandParameterSchema = z.object({
    param: z.number(),
  })
  const commandOneOutputSchema = z.object({
    output: z.object({
      commandOne: z.string(),
      commandTwo: z.string(),
    }),
  })

  const commandTwoPayloadSchema = z.object({
    input: z.string(),
  })

  const commandTwoOutputSchema = z.object({
    output: z.string(),
  })

  const subscriptionOneSchema = z.object({
    result: z.string(),
  })

  type ParameterType = z.output<typeof commandParameterSchema>

  type CommandOnePayload = z.input<typeof commandOnePayloadSchema>
  type CommandTwoPayload = z.input<typeof commandTwoPayloadSchema>
  type CommandTwoOutput = z.output<typeof commandTwoOutputSchema>

  afterAll(() => {
    sandbox.restore()
  })

  describe('creates the service one', () => {
    serviceOneBuilder = new ServiceBuilder(serviceOneInfo)

    const serviceOneSchema = z.object({
      optionOne: z.string(),
    })

    serviceOneBuilder.setConfigSchema(serviceOneSchema).setDefaultConfig({ optionOne: 'option one' })
  })

  describe('creates the service two', () => {
    serviceTwoBuilder = new ServiceBuilder(serviceTwoInfo)

    const serviceTwoSchema = z.object({
      optionTwo: z.string(),
    })

    serviceTwoBuilder.setConfigSchema(serviceTwoSchema).setDefaultConfig({ optionTwo: 'option two' })
  })

  describe('creates a command for service one', () => {
    const commandOneDefinitionBuilder = serviceOneBuilder
      .getCommandBuilder('commandOne', 'command one at service one')
      .setSuccessEventName('commandOneEmitted')
      .addPayloadSchema(commandOnePayloadSchema)
      .addParameterSchema(commandParameterSchema)
      .addOutputSchema(commandOneOutputSchema)
      .setTransformInput(z.string(), commandParameterSchema, async (context, payload, parameter) => {
        const parsed = JSON.parse(payload)

        await context.startActiveSpan('activeSpan', {}, undefined, async () => {
          context.logger.debug('activeSpan')
        })

        await context.wrapInSpan('wrapInSpan', {}, async () => {
          context.logger.debug('wrapInSpan')
        })

        return {
          payload: parsed,
          parameter,
        }
      })
      .setTransformOutput(z.string(), async (context, payload, _parameter) => {
        await context.startActiveSpan('activeSpan', {}, undefined, async () => {
          context.logger.debug('activeSpan')
        })

        await context.wrapInSpan('wrapInSpan', {}, async () => {
          context.logger.debug('wrapInSpan')
        })

        return JSON.stringify(payload)
      })
      .setBeforeGuardHooks({
        first: async (_context, payload, parameter) => {
          beforeCommandGuardHookStub(payload, parameter)
        },
      })
      .setAfterGuardHooks({
        some: async (_context, result, payload, parameter) => {
          afterCommandGuardHookStub(result, result, payload, parameter)
        },
      })
      .exposeAsHttpEndpoint('POST', 'command-one')
      .setOpenApiSummary('more description')
      .setOpenApiOperationId('command-one')
      .addOpenApiErrorStatusCodes(StatusCode.Unauthorized)
      .addOpenApiTags('public')
      .disableHttpSecurity()
      .enableHttpSecurity()
      .addQueryParameters({ required: false, name: 'param' })
      .markAsDeprecated()
      .setCommandFunction(async (context, payload, parameter) => {
        const address = {
          serviceName: serviceTwoInfo.serviceName,
          serviceVersion: serviceTwoInfo.serviceVersion,
          serviceTarget: 'commandTwo',
        }

        const invokePayload: CommandTwoPayload = {
          input: 'input',
        }

        context.logger.debug('call commandTwo')

        const activeSpanResult = await context.startActiveSpan('test', {}, undefined, async () => {
          return 'activeSpanResult'
        })

        expect(activeSpanResult).toBe('activeSpanResult')

        const spanResult = await context.wrapInSpan('test', {}, async () => {
          return 'spanResult'
        })

        expect(spanResult).toBe('spanResult')

        const commandTwoResult = await context.invoke<CommandTwoOutput, CommandTwoPayload, ParameterType>(
          address,
          invokePayload,
          parameter,
        )
        return {
          output: {
            commandOne: 'RECEIVED:' + payload.input.toUpperCase(),
            commandTwo: commandTwoResult.output,
          },
        }
      })

    serviceOneBuilder.addCommandDefinition(commandOneDefinitionBuilder.getDefinition())

    it('can unit test command function', async () => {
      const eventBridgeMock = getEventBridgeMock(sandbox)
      const serviceLogger = getLoggerMock(sandbox)

      const service = serviceOneBuilder.getInstance(eventBridgeMock.mock, { logger: serviceLogger.mock })

      const commandOne = commandOneDefinitionBuilder.getCommandFunction().bind(service)

      const payload = { input: 'my input' }
      const parameter = { param: 1 }

      const messagePayload = JSON.stringify(payload)
      const messageParameter = parameter

      const invokePayload = 'input for command two'

      const contextMock = getCommandContextMock(messagePayload, messageParameter, sandbox)

      contextMock.stubs.invoke.resolves({ output: invokePayload.toUpperCase() })

      const result = await commandOne(contextMock.mock, payload, parameter)

      expect(result.output.commandOne).toStrictEqual('RECEIVED:MY INPUT')
      expect(result.output.commandTwo).toStrictEqual(invokePayload.toUpperCase())
      expect(contextMock.stubs.logger.debug.calledWith('call commandTwo')).toBeTruthy()
    })

    it('can unit test command input transform', async () => {
      const eventBridgeMock = getEventBridgeMock(sandbox)
      const serviceLogger = getLoggerMock(sandbox)

      const service = serviceOneBuilder.getInstance(eventBridgeMock.mock, { logger: serviceLogger.mock })

      const transformInput = commandOneDefinitionBuilder.getTransformInputFunction()
      if (!transformInput) {
        fail(new Error('transform input function not set'))
      }

      const payload = { input: 'my input' }
      const parameter = { param: 1 }

      const messagePayload = JSON.stringify(payload)
      const messageParameter = parameter

      const contextMock = getCommandTransformContextMock(messagePayload, messageParameter, sandbox)

      const result = await transformInput.bind(service)(contextMock.mock, messagePayload, messageParameter)

      expect(result.parameter).toStrictEqual(messageParameter)
      expect(result.payload).toStrictEqual(payload)
      expect(contextMock.stubs.logger.debug.calledWith('activeSpan')).toBeTruthy()
      expect(contextMock.stubs.logger.debug.calledWith('wrapInSpan')).toBeTruthy()
    })

    it('can unit test command output transform', async () => {
      const eventBridgeMock = getEventBridgeMock(sandbox)
      const serviceLogger = getLoggerMock(sandbox)

      const service = serviceOneBuilder.getInstance(eventBridgeMock.mock, { logger: serviceLogger.mock })

      const transformOutput = commandOneDefinitionBuilder.getTransformOutputFunction()
      if (!transformOutput) {
        fail(new Error('transform output function not set'))
      }

      const payload = { input: 'my input' }
      const parameter = { param: 1 }

      const messagePayload = JSON.stringify(payload)
      const messageParameter = parameter

      const contextMock = getCommandTransformContextMock(messagePayload, messageParameter, sandbox)

      const functionResult = {
        output: {
          commandOne: 'one',
          commandTwo: 'two',
        },
      }
      const result = await transformOutput.bind(service)(contextMock.mock, functionResult, parameter)

      expect(result).toStrictEqual(JSON.stringify(functionResult))
      expect(contextMock.stubs.logger.debug.calledWith('activeSpan')).toBeTruthy()
      expect(contextMock.stubs.logger.debug.calledWith('wrapInSpan')).toBeTruthy()
    })
  })

  describe('creates a subscription for service one', () => {
    const subscriptionOneBuilder = serviceOneBuilder
      .getSubscriptionBuilder('subscriptionOne', 'a subscription in service one')
      .filterReceivedBy(serviceOneInfo.serviceName, serviceOneInfo.serviceVersion, 'commandOne')
      .filterForMessageType(EBMessageType.Command)
      .addPayloadSchema(commandOnePayloadSchema)
      .addParameterSchema(commandParameterSchema)
      .addOutputSchema('subscriptionOneConsumed', subscriptionOneSchema)
      .setBeforeGuardHooks({
        one: async (_context, payload, parameter) => {
          beforeSubscriptionGuardHookStub(payload, parameter)
        },
      })
      .setAfterGuardHooks({
        two: async (_context, result, payload, parameter) => {
          afterSubscriptionGuardHookStub(result, result, payload, parameter)
        },
      })
      .setTransformInput(z.string(), commandParameterSchema, async (context, payload, parameter) => {
        const response = JSON.parse(payload) as CommandOnePayload

        await context.startActiveSpan('activeSpan', {}, undefined, async () => {
          context.logger.debug('activeSpan')
        })

        await context.wrapInSpan('wrapInSpan', {}, async () => {
          context.logger.debug('wrapInSpan')
        })

        return {
          payload: response,
          parameter,
        }
      })
      .setTransformOutput(z.string(), async (context, payload, _parameter) => {
        await context.startActiveSpan('activeSpan', {}, undefined, async () => {
          context.logger.debug('activeSpan')
        })

        await context.wrapInSpan('wrapInSpan', {}, async () => {
          context.logger.debug('wrapInSpan')
        })

        return JSON.stringify(payload)
      })
      .setSubscriptionFunction(async (context, payload, _parameter) => {
        context.logger.debug('subscription one')
        return {
          result: 'SUBSCRIPTION:' + payload.input.toUpperCase(),
        }
      })

    serviceOneBuilder.addSubscriptionDefinition(subscriptionOneBuilder.getDefinition())

    it('can unit test subscription function', async () => {
      const eventBridgeMock = getEventBridgeMock(sandbox)
      const serviceLogger = getLoggerMock(sandbox)

      const service = serviceOneBuilder.getInstance(eventBridgeMock.mock, { logger: serviceLogger.mock })

      const subscriptionOne = subscriptionOneBuilder.getSubscriptionFunction().bind(service)

      const payload = { input: 'my input' }
      const parameter = { param: 1 }

      const message = getCommandMessageMock({
        principalId: 'unit-test',
        payload: {
          payload: JSON.stringify(payload),
          parameter,
        },
      })

      const contextMock = getSubscriptionContextMock(message, sandbox)

      const result = await subscriptionOne(contextMock.mock, payload, parameter)

      expect(result.result).toStrictEqual('SUBSCRIPTION:MY INPUT')
      expect(contextMock.stubs.logger.debug.calledWith('subscription one')).toBeTruthy()
    })

    it('can unit test subscription transform input function', async () => {
      const eventBridgeMock = getEventBridgeMock(sandbox)
      const serviceLogger = getLoggerMock(sandbox)

      const service = serviceOneBuilder.getInstance(eventBridgeMock.mock, { logger: serviceLogger.mock })

      const transformInput = subscriptionOneBuilder.getTransformInputFunction()
      if (!transformInput) {
        fail(new Error('transform input function not set'))
      }

      const payload = { input: 'my input' }
      const parameter = { param: 1 }

      const message = getCommandMessageMock({
        principalId: 'unit-test',
        payload: {
          payload: JSON.stringify(payload),
          parameter,
        },
      })

      const contextMock = getSubscriptionTransformContextMock(message, sandbox)

      const result = await transformInput.bind(service)(
        contextMock.mock,
        message.payload.payload,
        message.payload.parameter,
      )

      expect(result.parameter).toStrictEqual(message.payload.parameter)
      expect(result.payload).toStrictEqual(payload)
      expect(contextMock.stubs.logger.debug.calledWith('activeSpan')).toBeTruthy()
      expect(contextMock.stubs.logger.debug.calledWith('wrapInSpan')).toBeTruthy()
    })

    it('can unit test subscription transform output function', async () => {
      const eventBridgeMock = getEventBridgeMock(sandbox)
      const serviceLogger = getLoggerMock(sandbox)

      const service = serviceOneBuilder.getInstance(eventBridgeMock.mock, { logger: serviceLogger.mock })

      const transformOutput = subscriptionOneBuilder.getTransformOutputFunction()
      if (!transformOutput) {
        fail(new Error('transform output function not set'))
      }

      const payload = { input: 'my input' }
      const parameter = { param: 1 }

      const message = getCommandMessageMock({
        principalId: 'unit-test',
        payload: {
          payload: JSON.stringify(payload),
          parameter,
        },
      })

      const contextMock = getSubscriptionTransformContextMock(message, sandbox)

      const functionResult = {
        result: 'SUBSCRIPTION:MY INPUT',
      }
      const result = await transformOutput.bind(service)(contextMock.mock, functionResult, parameter)

      expect(result).toStrictEqual(JSON.stringify(functionResult))
      expect(contextMock.stubs.logger.debug.calledWith('activeSpan')).toBeTruthy()
      expect(contextMock.stubs.logger.debug.calledWith('wrapInSpan')).toBeTruthy()
    })
  })

  describe('creates a command for service two', () => {
    const commandTwoDefinitionBuilder = serviceTwoBuilder
      .getCommandBuilder('commandTwo', 'command two at service two', 'commandTwoCalled')
      .addPayloadSchema(commandTwoPayloadSchema)
      .addParameterSchema(commandParameterSchema)
      .addOutputSchema(commandTwoOutputSchema)
      .setCommandFunction(async (_context, payload, _parameter) => {
        return {
          output: payload.input.toUpperCase(),
        }
      })

    serviceTwoBuilder.addCommandDefinition(commandTwoDefinitionBuilder.getDefinition())
  })

  describe('creates a subscription for service two', () => {
    const subscriptionTwoDefinitionBuilder = serviceTwoBuilder
      .getSubscriptionBuilder('subscriptionTwo', 'subscription two at service two')
      .subscribeToEvent('subscriptionOneConsumed', '1')
      .addPayloadSchema(z.string())
      .setSubscriptionFunction(async (_context, _payload, _parameter) => {})

    serviceTwoBuilder.addSubscriptionDefinition(subscriptionTwoDefinitionBuilder.getDefinition())
  })

  it('works with default event bridge', async () => {
    // jest.useFakeTimers()

    const logger = getLoggerMock(sandbox)
    const eventBridge = new DefaultEventBridge({ logger: logger.mock })
    await eventBridge.start()

    const serviceOne = serviceOneBuilder.getInstance(eventBridge)
    await serviceOne.start()

    const serviceTwo = serviceTwoBuilder.getInstance(eventBridge)
    await serviceTwo.start()

    const message = getCommandMessageMock({
      receiver: {
        serviceName: serviceOneInfo.serviceName,
        serviceVersion: serviceOneInfo.serviceVersion,
        serviceTarget: 'commandOne',
      },
      principalId: 'live-test',
      payload: {
        payload: '{"input":"one"}',
        parameter: {
          param: 1,
        },
      },
    })

    const result = await eventBridge.invoke<string>(message)

    await expect(eventBridge.isReady()).toBeTruthy()
    await expect(eventBridge.isHealthy()).toBeTruthy()

    await serviceOne.destroy()
    await serviceTwo.destroy()
    await eventBridge.destroy()

    // jest.runAllTimers()

    expect(result).toStrictEqual('{"output":{"commandOne":"RECEIVED:ONE","commandTwo":"INPUT"}}')
    expect(logger.stubs.fatal.called).toBeFalsy()
    expect(logger.stubs.error.called).toBeFalsy()
    expect(logger.stubs.warn.called).toBeFalsy()

    expect(beforeCommandGuardHookStub.called).toBeTruthy()
    expect(afterCommandGuardHookStub.called).toBeTruthy()

    expect(beforeSubscriptionGuardHookStub).toBeTruthy()
    expect(afterSubscriptionGuardHookStub.called).toBeTruthy()
  })
})
