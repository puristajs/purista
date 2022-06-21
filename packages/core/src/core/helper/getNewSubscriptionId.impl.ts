import { SubscriptionId } from '../types'
import { getUniqueId } from './getUniqueId.impl'

export const getNewSubscriptionId = (): SubscriptionId => getUniqueId()
