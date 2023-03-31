import { ServiceEvent } from '../../../../ServiceEvent.enum'
import { userV1ServiceBuilder } from '../../userV1ServiceBuilder'
import { userV1PingInputParameterSchema, userV1PingInputPayloadSchema, userV1PingOutputPayloadSchema } from './schema'

export const pingCommandBuilder = userV1ServiceBuilder
  .getCommandBuilder('ping', 'ping pong')
  .setSuccessEventName(ServiceEvent.Pong)
  .addPayloadSchema(userV1PingInputPayloadSchema)
  .addParameterSchema(userV1PingInputParameterSchema)
  .addOutputSchema(userV1PingOutputPayloadSchema)
  .setCommandFunction(async function (_context, _payload, _parameter) {
    // add your business logic here
    return 'PONG!'
  })
