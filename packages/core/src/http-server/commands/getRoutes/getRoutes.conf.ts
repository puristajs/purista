import { FunctionDefinitionBuilder } from '../../../helper'
import { HttpServerService } from '../../HttpServerService.impl'
import { getRoutes } from './getRoutes.impl'
import { inputParameterSchema, inputPayloadSchema, outputPayloadSchema } from './schema'

export const builder = new FunctionDefinitionBuilder<HttpServerService>('getRoutes', 'get all http routes')
  .addParameterSchema(inputParameterSchema)
  .addOutputSchema(outputPayloadSchema)
  .addInputSchema(inputPayloadSchema)
  .setFunction(getRoutes)
