import { context, propagation } from '@opentelemetry/api'
import type { EBMessage, Logger } from '@purista/core'
import { deserializeOtp } from '@purista/core'
import type { UserProperties } from 'mqtt-packet'

export const deserializeOtpFromMqtt = (logger: Logger, message: EBMessage, userProperties: UserProperties = {}) => {
	// try to use mqtt user property first
	if (userProperties.traceparent) {
		return propagation.extract(context.active(), userProperties)
	}

	return deserializeOtp(logger, message.otp)
}
