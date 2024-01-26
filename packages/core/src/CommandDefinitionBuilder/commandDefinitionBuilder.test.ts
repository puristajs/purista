import { createSandbox } from 'sinon'
import { z } from 'zod'

import { Service } from '../core/index.js'
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

  it('can build a command with schemas', async () => {
    const functionPayloadSchema = z.object({ foo: z.string(), bar: z.number() })
    const functionParameterSchema = z.object({ paramOne: z.string(), paramTwo: z.number() })
    const functionOutputSchema = z.object({
      result: z.object({
        payload: z.object({ foo: z.string(), bar: z.number(), other: z.string() }),
        parameter: z.object({ paramOne: z.string(), paramTwo: z.number() }),
      }),
    })
    const transformPayloudSchema = z.string()
    const transformParameterSchema = z.string()
    const transformOutputSchema = z.string()

    const builder = new CommandDefinitionBuilder('testCommand', 'a unit test command')
      .addPayloadSchema(functionPayloadSchema)
      .addParameterSchema(functionParameterSchema)
      .addOutputSchema(functionOutputSchema)
      .setTransformInput(transformPayloudSchema, transformParameterSchema, async (_context, payload, parameter) => {
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
        'testCommand',
        functionOutputSchema,
        functionPayloadSchema,
        functionParameterSchema,
      )
      .setCommandFunction(async (context, payload, parameter) => {
        const result = await context.service.OtherService[2].testCommand(payload, parameter)
        return result
      })

    const commandFunction = builder.getCommandFunction().bind(service)
    const payload = {
      foo: 'foo',
      bar: 1,
    }
    const parameter = {
      paramOne: 'Parameter 1',
      paramTwo: 2,
    }
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
        payload: { ...payload, other: 'added by invoke' },
        parameter,
      },
    })
  })
})
