import { theServiceServiceBuilder } from '../../theServiceServiceBuilder'
import {
  theServiceV1DeleteInputParameterSchema,
  theServiceV1DeleteInputPayloadSchema,
  theServiceV1DeleteOutputPayloadSchema,
} from './schema'

export const deleteCommandBuilder = theServiceServiceBuilder
  .getCommandBuilder('delete', 'provide a dummy command')
  .addPayloadSchema(theServiceV1DeleteInputPayloadSchema)
  .addParameterSchema(theServiceV1DeleteInputParameterSchema)
  .addOutputSchema(theServiceV1DeleteOutputPayloadSchema)
  .exposeAsHttpEndpoint('DELETE', 'delete')
  .setCommandFunction(async function (_context, _payload, _parameter) {})
