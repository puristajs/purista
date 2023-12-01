import { context, propagation } from '@opentelemetry/api'
import type { EBMessage, Logger } from '@purista/core'
import { deserializeOtp } from '@purista/core'
import type { MsgHdrs } from 'nats'

export const deserializeOtpFromNats = (logger: Logger, message: EBMessage, headers?: MsgHdrs) => {
  // try to use mqtt user property first
  if (headers?.has('traceparent')) {
    return propagation.extract(context.active(), headers)
  }

  return deserializeOtp(logger, message.otp)
}
