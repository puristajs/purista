import { theServiceServiceBuilder } from '../../theServiceServiceBuilder'
import {
  theServiceV1PatchInputParameterSchema,
  theServiceV1PatchInputPayloadSchema,
  theServiceV1PatchOutputPayloadSchema,
} from './schema'

export const patchCommandBuilder = theServiceServiceBuilder
  .getCommandBuilder('patch', 'provide a dummy command')
  .addPayloadSchema(theServiceV1PatchInputPayloadSchema)
  .addParameterSchema(theServiceV1PatchInputParameterSchema)
  .addOutputSchema(theServiceV1PatchOutputPayloadSchema)
  .exposeAsHttpEndpoint('PATCH', 'patch')
  .setCommandFunction(async function (_context, payload, _parameter) {
    return {
      payload,
    }
  })
