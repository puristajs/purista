import { context, propagation } from '@opentelemetry/api'

export const serializeOtpToMqtt = <T extends Record<string, unknown>>(serializedContext: T) => {
  propagation.inject(context.active(), serializedContext)
  return serializedContext
}
