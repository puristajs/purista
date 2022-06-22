import { FunctionDefinitionBuilder } from '@purista/core'

import { inputParameterSchema, inputPayloadSchema, outputPayloadSchema } from './schema'
import { signUp } from './signUp'

export default new FunctionDefinitionBuilder('signUp', 'Sign up a new unknown user', signUp)
  .addInputSchema(inputPayloadSchema)
  .addParameterSchema(inputParameterSchema)
  .addOutputSchema(outputPayloadSchema)
  .exposeAsHttpEndpoint('POST', '/sign-up')
