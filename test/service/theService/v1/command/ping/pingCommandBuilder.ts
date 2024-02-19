import { theServiceServiceBuilder } from '../../theServiceServiceBuilder.js'
import {
  theServiceV1PingInputParameterSchema,
  theServiceV1PingInputPayloadSchema,
  theServiceV1PingOutputPayloadSchema,
} from './schema.js'

export const pingCommandBuilder = theServiceServiceBuilder
  .getCommandBuilder('ping', 'provide a dummy command')
  .addPayloadSchema(theServiceV1PingInputPayloadSchema)
  .addParameterSchema(theServiceV1PingInputParameterSchema)
  .addOutputSchema(theServiceV1PingOutputPayloadSchema)
  .exposeAsHttpEndpoint('GET', 'ping')
  .addQueryParameters({ name: 'param', required: false }, { required: true, name: 'required' })
  .setCommandFunction(async function (_context, _payload, _parameter) {
    return {
      ping: true,
    }
  })
