import { context, propagation } from '@opentelemetry/api'

export const serializeOtpToNats = function (serializedContext: Record<string, string> = {}) {
  propagation.inject(context.active(), serializedContext)
  return serializedContext
}
