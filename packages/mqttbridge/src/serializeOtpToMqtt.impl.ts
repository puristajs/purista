import { context, propagation } from '@opentelemetry/api'

/**
 * Injects the active OpenTelemetry context into MQTT user properties.
 */
export const serializeOtpToMqtt = <T extends Record<string, unknown>>(serializedContext: T) => {
	propagation.inject(context.active(), serializedContext)
	return serializedContext
}
