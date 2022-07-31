import { UserFunction } from '../../UserFunction.enum'
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
    logger.debug('called with payload', payload, parameter)

    return 'response payload for invocation'
  })
