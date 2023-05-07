import { context, propagation } from '@opentelemetry/api'

export const serializeOtpToMqtt = (serializedContext: Record<string, string> = {}) => {
  propagation.inject(context.active(), serializedContext)
  return serializedContext
}
