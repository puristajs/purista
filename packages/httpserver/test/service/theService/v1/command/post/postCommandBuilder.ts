import { theServiceServiceBuilder } from '../../theServiceServiceBuilder'
import {
  theServiceV1PostInputParameterSchema,
  theServiceV1PostInputPayloadSchema,
  theServiceV1PostOutputPayloadSchema,
} from './schema'

export const postCommandBuilder = theServiceServiceBuilder
  .getCommandBuilder('post', 'provide a dummy command')
  .addPayloadSchema(theServiceV1PostInputPayloadSchema)
  .addParameterSchema(theServiceV1PostInputParameterSchema)
  .addOutputSchema(theServiceV1PostOutputPayloadSchema)
  .exposeAsHttpEndpoint('POST', 'post')
  .setCommandFunction(async function (_context, payload, _parameter) {
    return {
      payload,
    }
  })
