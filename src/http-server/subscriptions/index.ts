import { SubscriptionDefinition } from '../../core'
import { getServiceCommandsToRestApi } from './ServiceCommandsToRestApi'

export const SUBSCRIPTIONS: SubscriptionDefinition[] = [getServiceCommandsToRestApi()]
