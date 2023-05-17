import { ServiceEvent } from '../../../../ServiceEvent.enum'
import { pingV1ServiceBuilder } from '../../pingV1ServiceBuilder'
import { pingV1LogInputPayloadSchema } from './schema'

export const logSubscriptionBuilder = pingV1ServiceBuilder
  .getSubscriptionBuilder('log', 'logs the ping events')
  .subscribeToEvent(ServiceEvent.Pinged)
  .addPayloadSchema(pingV1LogInputPayloadSchema)
  .setSubscriptionFunction(async function (context, payload, _parameter) {
    // add your business logic here
    context.logger.info(`there was a ping responded with ${payload.pong}`)
  })
