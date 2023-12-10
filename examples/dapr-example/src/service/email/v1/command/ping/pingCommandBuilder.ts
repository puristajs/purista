import { ServiceEvent } from '../../../../ServiceEvent.enum.js'
import { emailV1ServiceBuilder } from '../../emailV1ServiceBuilder.js'
import {
  emailV1PingInputParameterSchema,
  emailV1PingInputPayloadSchema,
  emailV1PingOutputPayloadSchema,
} from './schema.js'

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
