import { theServiceServiceBuilder } from '../../theServiceServiceBuilder.js'
import {
  theServiceV1ErrorInputParameterSchema,
  theServiceV1ErrorInputPayloadSchema,
  theServiceV1ErrorOutputPayloadSchema,
} from './schema.js'

export const errorCommandBuilder = theServiceServiceBuilder
  .getCommandBuilder('error', 'provide a dummy command')
  .addPayloadSchema(theServiceV1ErrorInputPayloadSchema)
  .addParameterSchema(theServiceV1ErrorInputParameterSchema)
  .addOutputSchema(theServiceV1ErrorOutputPayloadSchema)
  .exposeAsHttpEndpoint('GET', 'error')
  .setCommandFunction(async function (_context, _payload, _parameter) {
    throw new Error('some error')
  })
