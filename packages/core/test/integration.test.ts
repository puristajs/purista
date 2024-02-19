import { fail } from 'assert'
import { createSandbox } from 'sinon'
import { z } from 'zod'

import type { ServiceInfoType } from '../src/index.js'
import { DefaultEventBridge, EBMessageType, safeBind, ServiceBuilder, StatusCode } from '../src/index.js'
import {
  getCommandMessageMock,
  getCommandTransformContextMock,
  getEventBridgeMock,
  getLoggerMock,
  getSubscriptionTransformContextMock,
} from '../src/mocks/index.js'

describe('integration test', () => {
  const sandbox = createSandbox()

  const beforeCommandGuardHookStub = sandbox.stub()
  const afterCommandGuardHookStub = sandbox.stub()

  const beforeSubscriptionGuardHookStub = sandbox.stub()
  const afterSubscriptionGuardHookStub = sandbox.stub()

  const serviceOneInfo = {
    serviceName: 'ServiceOne',
    serviceVersion: '1',
    serviceDescription: 'service one description',
  } as const satisfies ServiceInfoType

  const serviceTwoInfo = {
    serviceName: 'ServiceTwo',
    serviceVersion: '1',
    serviceDescription: 'service two description',
  } as const satisfies ServiceInfoType

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

  type CommandOnePayload = z.input<typeof commandOnePayloadSchema>
  type CommandTwoPayload = z.input<typeof commandTwoPayloadSchema>

  const serviceOneBuilder = new ServiceBuilder(serviceOneInfo)

  const serviceOneSchema = z.object({
    optionOne: z.string(),
  })

  serviceOneBuilder.setConfigSchema(serviceOneSchema).setDefaultConfig({ optionOne: 'option one' })

  const serviceTwoBuilder = new ServiceBuilder(serviceTwoInfo)

  const serviceTwoSchema = z.object({
    optionTwo: z.string(),
  })

  serviceTwoBuilder.setConfigSchema(serviceTwoSchema).setDefaultConfig({ optionTwo: 'option two' })

  afterAll(() => {
    sandbox.restore()
  })

  describe('creates a command for service one', () => {
    const commandOneDefinitionBuilder = serviceOneBuilder
      .getCommandBuilder('commandOne', 'command one at service one')
      .setSuccessEventName('commandOneEmitted')
      .addPayloadSchema(commandOnePayloadSchema)
      .addParameterSchema(commandParameterSchema)
      .addOutputSchema(commandOneOutputSchema)
      .setTransformInput(z.string(), commandParameterSchema, async function (context, payload, parameter) {
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
      .canInvoke(
        serviceTwoInfo.serviceName,
        serviceTwoInfo.serviceVersion,
        'commandTwo',
        commandTwoOutputSchema,
        commandTwoPayloadSchema,
        commandParameterSchema,
      )
      .setCommandFunction(async (context, payload, parameter) => {
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

        const commandTwoResult = await context.service.ServiceTwo['1'].commandTwo(invokePayload, parameter)
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

      const commandOne = safeBind(commandOneDefinitionBuilder.getCommandFunction(), service)

      const payload = { input: 'my input' }
      const parameter = { param: 1 }

      const messagePayload = JSON.stringify(payload)
      const messageParameter = parameter

      const invokePayload = 'input for command two'

      const contextMock = commandOneDefinitionBuilder.getCommandContextMock(messagePayload, messageParameter, sandbox)

      contextMock.stubs.service.ServiceTwo['1'].commandTwo.resolves({ output: invokePayload.toUpperCase() })

      const result = await commandOne(contextMock.mock, payload, parameter)

      expect(result.output.commandOne).toBe('RECEIVED:MY INPUT')
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

      const result = await safeBind(transformInput, service)(contextMock.mock, messagePayload, messageParameter)

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
      const result = await safeBind(transformOutput, service)(contextMock.mock, functionResult, parameter)

      expect(result).toStrictEqual(JSON.stringify(functionResult))
      expect(contextMock.stubs.logger.debug.calledWith('activeSpan')).toBeTruthy()
      expect(contextMock.stubs.logger.debug.calledWith('wrapInSpan')).toBeTruthy()
    })
  })

  describe('creates a subscription for service one', () => {
    const subscriptionOneBuilder = serviceOneBuilder
      .getSubscriptionBuilder('subscriptionOne', 'a subscription in service one')
      .filterReceivedBy(serviceOneInfo.serviceName, serviceOneInfo.serviceVersion, 'commandOne', undefined)
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

      const subscriptionOne = safeBind(subscriptionOneBuilder.getSubscriptionFunction(), service)

      const payload = { input: 'my input' }
      const parameter = { param: 1 }

      const message = getCommandMessageMock({
        principalId: 'unit-test',
        payload: {
          payload: JSON.stringify(payload),
          parameter,
        },
      })

      const contextMock = subscriptionOneBuilder.getSubscriptionContextMock(message, sandbox)

      const result = await subscriptionOne(contextMock.mock, payload, parameter)

      expect(result.result).toBe('SUBSCRIPTION:MY INPUT')
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

      const result = await safeBind(transformInput, service)(
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
      const result = await safeBind(transformOutput, service)(contextMock.mock, functionResult, parameter)

      expect(result).toStrictEqual(JSON.stringify(functionResult))
      expect(contextMock.stubs.logger.debug.calledWith('activeSpan')).toBeTruthy()
      expect(contextMock.stubs.logger.debug.calledWith('wrapInSpan')).toBeTruthy()
    })
  })

  it('creates a command for service two', () => {
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
    expect(true).toBeTruthy()
  })

  it('creates a subscription for service two', () => {
    const subscriptionTwoDefinitionBuilder = serviceTwoBuilder
      .getSubscriptionBuilder('subscriptionTwo', 'subscription two at service two')
      .subscribeToEvent('subscriptionOneConsumed', '1')
      .addPayloadSchema(z.string())
      .setSubscriptionFunction(async (_context, _payload, _parameter) => {})

    serviceTwoBuilder.addSubscriptionDefinition(subscriptionTwoDefinitionBuilder.getDefinition())
    expect(true).toBeTruthy()
  })

  it('works with default event bridge', async () => {
    // jest.useFakeTimers()

    const logger = getLoggerMock(sandbox)
    const eventBridge = new DefaultEventBridge({ logger: logger.mock })
    await eventBridge.start()

    const serviceOne = serviceOneBuilder.getInstance(eventBridge, { logger: getLoggerMock().mock })
    await serviceOne.start()

    const serviceTwo = serviceTwoBuilder.getInstance(eventBridge, { logger: getLoggerMock().mock })
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

    expect(result).toBe('{"output":{"commandOne":"RECEIVED:ONE","commandTwo":"INPUT"}}')
    expect(logger.stubs.fatal.called).toBeFalsy()
    expect(logger.stubs.error.called).toBeFalsy()
    expect(logger.stubs.warn.called).toBeFalsy()

    expect(beforeCommandGuardHookStub.called).toBeTruthy()
    expect(afterCommandGuardHookStub.called).toBeTruthy()

    expect(beforeSubscriptionGuardHookStub).toBeTruthy()
    expect(afterSubscriptionGuardHookStub.called).toBeTruthy()
  })
})
