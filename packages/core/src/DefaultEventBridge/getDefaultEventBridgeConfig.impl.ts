import type { Complete } from '../core/types/Complete.js'
import type { DefaultEventBridgeConfig } from './types/DefaultEventBridgeConfig.js'

export const getDefaultEventBridgeConfig = (): Complete<DefaultEventBridgeConfig> => {
	const defaultConfig: Complete<DefaultEventBridgeConfig> = {
		logWarnOnMessagesWithoutReceiver: true,
		emitMessagesAsEventBridgeEvents: false,
	}

	return defaultConfig
}
