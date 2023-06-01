import { NatsBridgeConfig } from './types'

const SECONDS_PER_DAY = 86_400
export const getDefaultNatsBridgeConfig = (): NatsBridgeConfig => {
  return {
    topicPrefix: 'purista',
    emptyTopicPartString: '__empty__',
    commandResponsePublishTwice: 'eventOnly',
    defaultMessageExpiryInterval: 30 * SECONDS_PER_DAY,
    maxMessages: 10,
  }
}
