import { createSandbox } from 'sinon'
import { z } from 'zod'

import { Service } from '../core/index.js'
import { safeBind } from '../helper/index.js'
import { getEventBridgeMock, getLoggerMock } from '../mocks/index.js'
import { CommandDefinitionBuilder } from './CommandDefinitionBuilder.impl.js'

describe('CommandDefinitionBuilder', () => {
  const sandbox = createSandbox()
  const service = new Service({
    info: { serviceName: 'TestService', serviceVersion: '1', serviceDescription: 'A service' },
    commandDefinitionList: [],
    subscriptionDefinitionList: [],
    logger: getLoggerMock(sandbox).mock,
    eventBridge: getEventBridgeMock(sandbox).mock,
    config: {},
  })

  const functionPayloadSchema = z.object({ foo: z.string(), bar: z.number(), def: z.string().default('default_value') })
  const functionParameterSchema = z.object({
    paramOne: z.string(),
    paramTwo: z.number(),
    def: z.string().default('default_param'),
  })
  const functionOutputSchema = z.object({
    result: z.object({
      payload: z.object({ foo: z.string(), bar: z.number(), other: z.string(), def: z.string() }),
      parameter: z.object({ paramOne: z.string(), paramTwo: z.number(), def: z.string() }),
    }),
  })
  const transformPayloudSchema = z.string()
  const transformParameterSchema = z.string()
  const transformOutputSchema = z.string()

  const beforeOneStub = sandbox.stub()
  const afterOneStub = sandbox.stub()

  const builder = new CommandDefinitionBuilder('testCommand', 'a unit test command')
    .addPayloadSchema(functionPayloadSchema)
    .addParameterSchema(functionParameterSchema)
    .addOutputSchema(functionOutputSchema)
    .setTransformInput(transformPayloudSchema, transformParameterSchema, async (_context, payload, parameter) => {
      expect(typeof payload).toBe('string')
      expect(typeof parameter).toBe('string')

      const pay: {
        foo: string
        bar: number
      } = JSON.parse(payload)
      const param: {
        paramOne: string
        paramTwo: number
      } = JSON.parse(parameter)

      return {
        payload: pay,
        parameter: param,
      }
    })
    .setTransformOutput(transformOutputSchema, async (_context, payload, _parameter) => {
      const p: Readonly<{
        result: {
          payload: {
            foo: string
            bar: number
            def: string
            other: string
          }
          parameter: {
            paramOne: string
            paramTwo: number
          }
        }
      }> = payload
      return JSON.stringify(p)
    })
    .setBeforeGuardHooks({
      beforeOne: async (_context, payload, parameter) => {
        const pay: {
          foo: string
          bar: number
          def: string
        } = payload

        const param: {
          def: string
          paramOne: string
          paramTwo: number
        } = parameter
        beforeOneStub(pay, param)
      },
    })
    .setAfterGuardHooks({
      afterOne: async (_context, fnOutputPayload, input, parameter) => {
        const pay: {
          foo: string
          bar: number
          def: string
        } = input

        const param: {
          def: string
          paramOne: string
          paramTwo: number
        } = parameter

        const fnRes: {
          result: {
            payload: {
              foo: string
              bar: number
              def: string
              other: string
            }
            parameter: {
              def: string
              paramOne: string
              paramTwo: number
            }
          }
        } = fnOutputPayload

        afterOneStub(fnRes, pay, param)
      },
    })
    .canInvoke(
      'OtherService',
      '2',
      'testCommand',
      functionOutputSchema.merge(z.object({ toBeRemovedInResponse: z.string() })),
      functionPayloadSchema,
      functionParameterSchema,
    )
    .canEmit('some', z.object({ example: z.string() }))
    .setCommandFunction(async (context, payload, parameter) => {
      const result = await context.service.OtherService[2].testCommand(payload, parameter)

      const response: {
        result: {
          payload: {
            foo: string
            bar: number
            def: string
            other: string
          }
          parameter: {
            def: string
            paramOne: string
            paramTwo: number
          }
        }
        toBeRemovedInResponse: string
      } = result

      context.emit('some', { example: 'test' })

      return response
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

  it('can build a command with schemas', async () => {
    const commandFunction = safeBind(builder.getCommandFunction(), service)
    const context = builder.getCommandContextMock(JSON.stringify(payload), JSON.stringify(parameter))
    context.stubs.service.OtherService[2].testCommand.callsFake(async (payload, parameter) => {
      return {
        result: {
          payload: { ...payload, other: 'added by invoke' },
          parameter,
        },
      }
    })

    const result = await commandFunction(context.mock, payload, parameter)

    expect(result).toStrictEqual({
      result: {
        payload: { ...payload, other: 'added by invoke', def: 'default_value' },
        parameter: { ...parameter, def: 'default_param' },
      },
    })

    expect(context.stubs.emit['some'].called).toBeTruthy()
    expect(beforeOneStub.callCount).toBe(1)
  })

  it('executes the plain function without hooks and schema validation', async () => {
    const commandFunction = safeBind(builder.getCommandFunctionPlain(), service)
    const context = builder.getCommandContextMock(JSON.stringify(payload), JSON.stringify(parameter))
    context.stubs.service.OtherService[2].testCommand.callsFake(async (payload, parameter) => {
      return {
        result: {
          payload: { ...payload, other: 'added by invoke' },
          parameter,
          toBeRemovedInResponse: 'removed by output schema',
        },
      }
    })

    const result = await commandFunction(
      context.mock,
      { ...payload, def: 'default_value' },
      { ...parameter, def: 'default_param' },
    )

    expect(result).toStrictEqual({
      result: {
        payload: { ...payload, other: 'added by invoke', def: 'default_value' },
        parameter: { ...parameter, def: 'default_param' },
        toBeRemovedInResponse: 'removed by output schema',
      },
    })

    expect(context.stubs.emit['some'].called).toBeTruthy()
    expect(beforeOneStub.callCount).toBe(0)
  })

  it('does not throw on transform input', async () => {
    const fn = builder.getTransformInputFunction()

    if (!fn) {
      expect(fn).toBeDefined()
      return
    }

    const transformFunction = safeBind(fn, service)

    const context = builder.getCommandTransformContextMock(JSON.stringify(payload), JSON.stringify(parameter), sandbox)

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

    const context = builder.getCommandTransformContextMock(JSON.stringify(payload), JSON.stringify(parameter), sandbox)

    const result = await transformFunction(
      context.mock,
      {
        result: {
          payload: { ...payload, other: 'added by invoke', def: 'default_value' },
          parameter: { ...parameter, def: 'default_param' },
        },
      },
      { ...parameter, def: 'default_param' },
    )

    expect(result).toStrictEqual(
      JSON.stringify({
        result: {
          payload: { ...payload, other: 'added by invoke', def: 'default_value' },
          parameter: { ...parameter, def: 'default_param' },
        },
      }),
    )
  })

  it('works with without schema', async () => {
    const b = new CommandDefinitionBuilder('testCommand', 'a unit test command')

    b.setCommandFunction(async (context, payload, parameter) => {
      return { payload, parameter }
    })

    const fn = b.getCommandFunction()

    const theFunction = safeBind(fn, service)

    const context = b.getCommandContextMock('', {}, sandbox)

    const result = await theFunction(context.mock, 'y', 'x')

    expect(result).toStrictEqual({
      payload: 'y',
      parameter: 'x',
    })
  })
})
