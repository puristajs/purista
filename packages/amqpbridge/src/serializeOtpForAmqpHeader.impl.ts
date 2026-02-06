import { context, propagation } from '@opentelemetry/api'

/**
 * Injects the active OpenTelemetry trace context into AMQP headers.
 * This enables cross-service trace propagation for messages.
 */
export const serializeOtpForAmqpHeader = (header: Record<string, string | undefined>) => {
	propagation.inject(context.active(), header)
	return header
}
