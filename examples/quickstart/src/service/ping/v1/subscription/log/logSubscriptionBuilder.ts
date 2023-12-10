import { ServiceEvent } from '../../../../ServiceEvent.enum.js'
import { pingV1ServiceBuilder } from '../../pingV1ServiceBuilder.js'
import { pingV1LogInputPayloadSchema } from './schema.js'

export const logSubscriptionBuilder = pingV1ServiceBuilder
  .getSubscriptionBuilder('log', 'logs the ping events')
  .subscribeToEvent(ServiceEvent.Pinged)
  .addPayloadSchema(pingV1LogInputPayloadSchema)
  .setSubscriptionFunction(async function (context, payload, _parameter) {
    // add your business logic here
    context.logger.info(`there was a ping responded with ${payload.pong}`)
  })
