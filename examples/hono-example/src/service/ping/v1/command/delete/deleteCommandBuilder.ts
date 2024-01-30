import { pingV1ServiceBuilder } from '../../pingV1ServiceBuilder.js'
import {
  theServiceV1DeleteInputParameterSchema,
  theServiceV1DeleteInputPayloadSchema,
  theServiceV1DeleteOutputPayloadSchema,
} from './schema.js'

export const deleteCommandBuilder = pingV1ServiceBuilder
  .getCommandBuilder('delete', 'provide a dummy command')
  .addPayloadSchema(theServiceV1DeleteInputPayloadSchema)
  .addParameterSchema(theServiceV1DeleteInputParameterSchema)
  .addOutputSchema(theServiceV1DeleteOutputPayloadSchema)
  .exposeAsHttpEndpoint('DELETE', 'delete')
  .setCommandFunction(async function (_context, _payload, _parameter) {})
