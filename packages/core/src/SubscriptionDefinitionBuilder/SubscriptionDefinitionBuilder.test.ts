import { createSandbox } from 'sinon'
import { z } from 'zod'

import { Service } from '../core/index.js'
import { safeBind } from '../helper/index.js'
import { getCommandMessageMock, getEventBridgeMock, getLoggerMock } from '../mocks/index.js'
import { SubscriptionDefinitionBuilder } from './SubscriptionDefinitionBuilder.impl.js'

describe('SubscriptionDefinitionBuilder', () => {
  const sandbox = createSandbox()
  const service = new Service({
    info: { serviceName: 'TestService', serviceVersion: '1', serviceDescription: 'A service' },
    commandDefinitionList: [],
    subscriptionDefinitionList: [],
    logger: getLoggerMock(sandbox).mock,
    eventBridge: getEventBridgeMock(sandbox).mock,
    config: {},
  })

  const functionPayloadSchema = z.object({ foo: z.string(), bar: z.number() })
  const functionParameterSchema = z.object({ paramOne: z.string(), paramTwo: z.number() })
  const functionOutputSchema = z.object({
    result: z.object({
      payload: z.object({ foo: z.string(), bar: z.number(), other: z.string() }),
      parameter: z.object({ paramOne: z.string(), paramTwo: z.number() }),
    }),
  })
  const transformPayloadSchema = z.string()
  const transformParameterSchema = z.string()
  const transformOutputSchema = z.string()

  const builder = new SubscriptionDefinitionBuilder('testSubscription', 'a unit test subscription')
    .addPayloadSchema(functionPayloadSchema)
    .addParameterSchema(functionParameterSchema)
    .addOutputSchema('subscriptionEndEmitted', functionOutputSchema)
    .setTransformInput(transformPayloadSchema, transformParameterSchema, async (_context, payload, parameter) => {
      const pay = JSON.parse(payload)
      const param = JSON.parse(parameter)

      return {
        payload: pay,
        parameter: param,
      }
    })
    .setTransformOutput(transformOutputSchema, async (_context, payload, _parameter) => {
      return JSON.stringify(payload)
    })
    .canInvoke(
      'OtherService',
      '2',
      'testSubscription',
      functionOutputSchema,
      functionPayloadSchema,
      functionParameterSchema,
    )
    .canEmit('some', z.object({ example: z.string() }))
    .setSubscriptionFunction(async (context, payload, parameter) => {
      const result = await context.service.OtherService[2].testSubscription(payload, parameter)

      context.emit('some', { example: 'test' })

      return result
    })

  const payload = {
    foo: 'foo',
    bar: 1,
  }
  const parameter = {
    paramOne: 'Parameter 1',
    paramTwo: 2,
  }

  beforeEach(() => {
    sandbox.reset()
  })

  afterAll(() => {
    sandbox.restore()
  })

  it('does not throw on subscription function', async () => {
    const subscriptionFunction = safeBind(builder.getSubscriptionFunction(), service)

    const msg = getCommandMessageMock({
      payload: {
        payload,
        parameter,
      },
    })

    const context = builder.getSubscriptionContextMock(msg, sandbox)
    context.stubs.service.OtherService[2].testSubscription.callsFake(async (payload, parameter) => {
      return {
        result: {
          payload: { ...payload, other: 'added by invoke' },
          parameter,
        },
      }
    })

    const result = await subscriptionFunction(context.mock, payload, parameter)

    expect(result).toStrictEqual({
      result: {
        payload: { ...payload, other: 'added by invoke' },
        parameter,
      },
    })

    expect(context.stubs.emit['some'].called).toBeTruthy()
  })

  it('does not throw on transform input', async () => {
    const fn = builder.getTransformInputFunction()

    if (!fn) {
      expect(fn).toBeDefined()
      return
    }

    const transformFunction = safeBind(fn, service)

    const msg = getCommandMessageMock({
      payload: {
        payload,
        parameter,
      },
    })

    const context = builder.getSubscriptionTransformContextMock(msg, sandbox)

    const result = await transformFunction(context.mock, JSON.stringify(payload), JSON.stringify(parameter))

    expect(result).toStrictEqual({ payload, parameter })
  })

  it('does not throw on transform output', async () => {
    const fn = builder.getTransformOutputFunction()

    if (!fn) {
      expect(fn).toBeDefined()
      return
    }

    const transformFunction = safeBind(fn, service)

    const msg = getCommandMessageMock({
      payload: {
        payload,
        parameter,
      },
    })

    const context = builder.getSubscriptionTransformContextMock(msg, sandbox)

    const result = await transformFunction(
      context.mock,
      { result: { payload: { ...payload, other: 'added by invoke' }, parameter } },
      parameter,
    )

    expect(result).toStrictEqual(
      JSON.stringify({ result: { payload: { ...payload, other: 'added by invoke' }, parameter } }),
    )
  })
})
