import { context, propagation } from '@opentelemetry/api'

export const serializeOtpForAmqpHeader = (header: Record<string, string | undefined>) => {
	propagation.inject(context.active(), header)
	return header
}
