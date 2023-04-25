import { userV1ServiceBuilder } from '../../userV1ServiceBuilder'
import {
  userV1ComputeDataInputParameterSchema,
  userV1ComputeDataInputPayloadSchema,
  userV1ComputeDataOutputPayloadSchema,
} from './schema'

export const computeDataCommandBuilder = userV1ServiceBuilder
  .getCommandBuilder('computeData', 'simulates something to demonstrate invoke')
  .addPayloadSchema(userV1ComputeDataInputPayloadSchema)
  .addParameterSchema(userV1ComputeDataInputParameterSchema)
  .addOutputSchema(userV1ComputeDataOutputPayloadSchema)
  .setCommandFunction(async function ({ logger }, payload, parameter) {
    logger.debug({ payload, parameter })
    return {
      invoked: payload,
    }
  })
