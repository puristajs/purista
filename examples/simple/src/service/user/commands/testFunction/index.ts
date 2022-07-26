import { FunctionDefinitionBuilder } from '@purista/core'

import { UserFunction } from '../../UserFunction.enum'
import { UserService } from '../../UserService'
import { inputParameterSchema, inputPayloadSchema, outputPayloadSchema } from './schema'

export default new FunctionDefinitionBuilder<UserService>(
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
