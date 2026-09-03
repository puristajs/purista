import { DefaultEventBridge, type Logger } from '@purista/core'
import type { ApplicationTelemetry } from './observability/ApplicationTelemetry.js'

export const getEventBridge = async (logger: Logger, telemetry?: ApplicationTelemetry) => {
	const eventBridge = new DefaultEventBridge({
		logger,
		spanProcessor: telemetry?.spanProcessor,
		metrics: telemetry ? { meter: telemetry.meter } : undefined,
	})
	await eventBridge.start()
	return eventBridge
}
