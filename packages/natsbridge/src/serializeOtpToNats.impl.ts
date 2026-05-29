import { context, propagation } from '@opentelemetry/api'

/**
 * Injects the active OpenTelemetry context into NATS headers/user metadata.
 */
export const serializeOtpToNats = function <T extends Record<string, unknown>>(serializedContext: T) {
	propagation.inject(context.active(), serializedContext)
	return serializedContext
}
