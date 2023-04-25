import { ServiceEvent } from '../../../../ServiceEvent.enum'
import { emailV1ServiceBuilder } from '../../emailV1ServiceBuilder'
import {
  emailV1PingInputParameterSchema,
  emailV1PingInputPayloadSchema,
  emailV1PingOutputPayloadSchema,
} from './schema'

export const pingCommandBuilder = emailV1ServiceBuilder
  .getCommandBuilder('ping', 'ping pong')
  .setSuccessEventName(ServiceEvent.Pong)
  .addPayloadSchema(emailV1PingInputPayloadSchema)
  .addParameterSchema(emailV1PingInputParameterSchema)
  .addOutputSchema(emailV1PingOutputPayloadSchema)
  .setCommandFunction(async function (_context, payload, _parameter) {
    // add your business logic here
    return {
      pong: payload,
    }
  })
