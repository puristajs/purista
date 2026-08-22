import { context, propagation } from '@opentelemetry/api'
import type { EBMessage, Logger } from '@purista/core/adapter'
import { deserializeOtp } from '@purista/core/adapter'
import type { MsgHdrs } from 'nats'

/**
 * Restores OpenTelemetry context from NATS headers or the message OTP.
 */
export const deserializeOtpFromNats = (logger: Logger, message: EBMessage, headers?: MsgHdrs) => {
	// try to use NATS headers first
	if (headers?.has('traceparent')) {
		return propagation.extract(context.active(), headers)
	}

	return deserializeOtp(logger, message.otp)
}
