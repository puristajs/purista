import type { NatsBridgeConfig } from './types/NatsBridgeConfig.js'

const SECONDS_PER_DAY = 86_400
export const getDefaultNatsBridgeConfig = (): NatsBridgeConfig => {
	return {
		topicPrefix: 'purista',
		emptyTopicPartString: '__empty__',
		commandResponsePublishTwice: 'eventOnly',
		defaultMessageExpiryInterval: 30 * SECONDS_PER_DAY,
		maxMessages: 10,
		jetStreamAckWaitMs: 30_000,
		durableSubscriptionMode: 'strict',
		defaultConsumerFailureHandling: {
			maxAttempts: 5,
			retryDelayMs: 1_000,
			deadLetterSuffix: '.dead-letter',
		},
	}
}
