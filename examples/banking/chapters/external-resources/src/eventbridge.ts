import { DefaultEventBridge, type Logger } from '@purista/core'

export const getEventBridge = async (logger: Logger) => {
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	return eventBridge
}
