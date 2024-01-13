import { ServiceEvent } from '../../../../ServiceEvent.enum.js'
import { userV1ServiceBuilder } from '../../userV1ServiceBuilder.js'
import {
  userV1PingInputParameterSchema,
  userV1PingInputPayloadSchema,
  userV1PingOutputPayloadSchema,
} from './schema.js'

export const pingCommandBuilder = userV1ServiceBuilder
  .getCommandBuilder('ping', 'ping pong')
  .setSuccessEventName(ServiceEvent.Pong)
  .addPayloadSchema(userV1PingInputPayloadSchema)
  .addParameterSchema(userV1PingInputParameterSchema)
  .addOutputSchema(userV1PingOutputPayloadSchema)
  .exposeAsHttpEndpoint('POST', 'ping', 'text/plain')
  .canInvoke('User', '1', 'computeData')
  .setCommandFunction(async function ({ service }, payload, _parameter) {
    // add your business logic here
    const pong = await service.User[1].computeData(payload, {})

    return {
      pong,
    }
  })
