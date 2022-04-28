import { FunctionDefinitionBuilder } from '../../../helper'
import { getRoutes } from './getRoutes.impl'
import { inputParameterSchema, outputPayloadSchema } from './schema'

export const builder = new FunctionDefinitionBuilder('testGet', 'some simple test function', getRoutes)
  .addParameterSchema(inputParameterSchema)
  .addOutputSchema(outputPayloadSchema)
