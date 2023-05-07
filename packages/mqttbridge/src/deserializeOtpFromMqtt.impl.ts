import { context, propagation } from '@opentelemetry/api'
import { deserializeOtp, EBMessage, Logger } from '@purista/core'
import { UserProperties } from 'mqtt'

export const deserializeOtpFromMqtt = (logger: Logger, message: EBMessage, userProperties: UserProperties = {}) => {
  // try to use mqtt user property first
  if (userProperties['traceparent']) {
    return propagation.extract(context.active(), userProperties)
  }

  return deserializeOtp(logger, message.otp)
}
