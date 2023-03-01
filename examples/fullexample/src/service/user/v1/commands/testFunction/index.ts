import { UserFunction } from '../../../../../types'
import { UserServiceBuilder } from '../../UserServiceBuilder'
import { inputParameterSchema, inputPayloadSchema, outputPayloadSchema } from './schema'

export const testFunctionBuilder = UserServiceBuilder.getFunctionBuilder(
  UserFunction.TestFunction,
  'a function called from other function',
)
  .addInputSchema(inputPayloadSchema)
  .addParameterSchema(inputParameterSchema)
  .addOutputSchema(outputPayloadSchema)

  .setFunction(async function ({ logger }, payload, parameter) {
    logger.debug({ payload, parameter }, 'called with payload')

    return 'response payload for invocation'
  })
