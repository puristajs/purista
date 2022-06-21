import { FunctionDefinitionBuilder } from '../../../helper'
import { getRoutes } from './getRoutes.impl'
import { inputParameterSchema, outputPayloadSchema } from './schema'

export const builder = new FunctionDefinitionBuilder('getRoutes', 'get all http routes', getRoutes)
  .addParameterSchema(inputParameterSchema)
  .addOutputSchema(outputPayloadSchema)
